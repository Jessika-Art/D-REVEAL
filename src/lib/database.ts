import { supabase, WaitlistSubmission, Report } from './supabase'
import fs from 'fs'
import path from 'path'

// Environment check - use database in production, files in development
const USE_DATABASE = process.env.NODE_ENV === 'production' || process.env.USE_DATABASE === 'true'

// File-based storage paths (for development)
const DATA_FILE = path.join(process.cwd(), 'data', 'waitlist-submissions.json')
const REPORTS_DIR = path.join(process.cwd(), 'data', 'reports')
const REPORTS_INDEX_FILE = path.join(REPORTS_DIR, 'index.json')

// Ensure data directory exists (for development)
function ensureDataDirectory() {
  if (USE_DATABASE) return
  
  const dataDir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true })
  }
}

// WAITLIST SUBMISSIONS
export async function saveWaitlistSubmission(submission: any) {
  if (USE_DATABASE) {
    // Save to Supabase
    const { data, error } = await supabase
      .from('waitlist_submissions')
      .insert([{
        id: submission.id,
        timestamp: submission.timestamp,
        full_name: submission.fullName,
        email: submission.email,
        company: submission.company,
        job_title: submission.jobTitle,
        company_type: submission.companyType,
        aum: submission.aum,
        primary_markets: submission.primaryMarkets,
        current_tools: submission.currentTools,
        team_size: submission.teamSize,
        biggest_challenge: submission.biggestChallenge,
        interest_level: submission.interestLevel,
        budget_range: submission.budgetRange,
        additional_notes: submission.additionalNotes
      }])
    
    if (error) throw error
    return data
  } else {
    // Save to file (development)
    ensureDataDirectory()
    const submissions = await getWaitlistSubmissions()
    submissions.push(submission)
    fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2))
    return submission
  }
}

export async function getWaitlistSubmissions() {
  if (USE_DATABASE) {
    // Get from Supabase
    const { data, error } = await supabase
      .from('waitlist_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Transform back to original format
    return data?.map(item => ({
      id: item.id,
      timestamp: item.timestamp,
      fullName: item.full_name,
      email: item.email,
      company: item.company,
      jobTitle: item.job_title,
      companyType: item.company_type,
      aum: item.aum,
      primaryMarkets: item.primary_markets,
      currentTools: item.current_tools,
      teamSize: item.team_size,
      biggestChallenge: item.biggest_challenge,
      interestLevel: item.interest_level,
      budgetRange: item.budget_range,
      additionalNotes: item.additional_notes
    })) || []
  } else {
    // Get from file (development)
    ensureDataDirectory()
    if (!fs.existsSync(DATA_FILE)) {
      return []
    }
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error reading submissions:', error)
      return []
    }
  }
}

// REPORTS
export async function saveReport(report: any) {
  if (USE_DATABASE) {
    // Save to Supabase
    const { data, error } = await supabase
      .from('reports')
      .insert([{
        id: report.id,
        token: report.token,
        client_name: report.clientName,
        generated_date: report.generatedDate,
        chart_file_name: report.chartFileName,
        json_file_name: report.jsonFileName,
        chart_url: report.chartUrl,
        data_url: report.dataUrl
      }])
    
    if (error) throw error
    return data
  } else {
    // Save to file (development)
    ensureDataDirectory()
    const reports = await getReports()
    reports.push(report)
    fs.writeFileSync(REPORTS_INDEX_FILE, JSON.stringify(reports, null, 2))
    return report
  }
}

export async function getReports() {
  if (USE_DATABASE) {
    // Get from Supabase
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Transform back to original format
    return data?.map(item => ({
      id: item.id,
      token: item.token,
      clientName: item.client_name,
      generatedDate: item.generated_date,
      createdAt: item.created_at,
      chartFileName: item.chart_file_name,
      jsonFileName: item.json_file_name,
      chartUrl: item.chart_url,
      dataUrl: item.data_url
    })) || []
  } else {
    // Get from file (development)
    ensureDataDirectory()
    if (!fs.existsSync(REPORTS_INDEX_FILE)) {
      return []
    }
    try {
      const data = fs.readFileSync(REPORTS_INDEX_FILE, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error loading reports:', error)
      return []
    }
  }
}

export async function getReportByToken(token: string) {
  if (USE_DATABASE) {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('token', token)
      .single()
    
    if (error) throw error
    
    if (!data) return null
    
    return {
      id: data.id,
      token: data.token,
      clientName: data.client_name,
      generatedDate: data.generated_date,
      createdAt: data.created_at,
      chartFileName: data.chart_file_name,
      jsonFileName: data.json_file_name,
      chartUrl: data.chart_url,
      dataUrl: data.data_url
    }
  } else {
    const reports = await getReports()
    return reports.find((report: any) => report.token === token) || null
  }
}

export async function deleteReport(id: string) {
  if (USE_DATABASE) {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  } else {
    const reports = await getReports()
    const filteredReports = reports.filter((report: any) => report.id !== id)
    fs.writeFileSync(REPORTS_INDEX_FILE, JSON.stringify(filteredReports, null, 2))
  }
}

// File upload to Supabase Storage
export async function uploadFile(file: Buffer, fileName: string, bucket: string) {
  if (!USE_DATABASE) {
    throw new Error('File upload only available in database mode')
  }
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      contentType: fileName.endsWith('.png') ? 'image/png' : 'application/json'
    })
  
  if (error) throw error
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)
  
  return urlData.publicUrl
}
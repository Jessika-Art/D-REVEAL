import plotly.graph_objects as go
import plotly.io as pio

# Example of how to enhance your Plotly chart export
# Replace this with your actual chart creation code

def create_enhanced_chart():
    # Your existing chart creation code here
    # This is just an example - replace with your actual data and chart
    fig = go.Figure()
    
    # Add your data/traces here
    # fig.add_trace(...)
    
    # Enhanced layout configuration for better embedding
    fig.update_layout(
        # Make the chart more responsive
        autosize=True,
        
        # Enhanced interaction settings
        dragmode='pan',  # Default to pan mode instead of zoom
        
        # Better margins for embedding
        margin=dict(l=0, r=0, t=0, b=0),
        
        # Remove unnecessary UI elements for cleaner embedding
        showlegend=True,
        
        # Enhanced zoom and pan behavior
        xaxis=dict(
            fixedrange=False,  # Allow zooming
            rangeslider=dict(visible=False),  # Hide range slider for cleaner look
        ),
        yaxis=dict(
            fixedrange=False,  # Allow zooming
        ),
        
        # Better responsive behavior
        responsive=True,
    )
    
    # Enhanced configuration for the HTML export
    config = {
        # Enable all the interactive features
        'displayModeBar': True,
        'displaylogo': False,
        'modeBarButtonsToRemove': [],
        
        # Enhanced zoom and pan
        'scrollZoom': True,
        'doubleClick': 'reset',
        'showTips': True,
        
        # Better responsive behavior
        'responsive': True,
        'autosizable': True,
        
        # Enhanced interaction
        'toImageButtonOptions': {
            'format': 'png',
            'filename': 'chart',
            'height': 500,
            'width': 700,
            'scale': 1
        },
        
        # Custom toolbar buttons (optional)
        'modeBarButtons': [
            ['pan2d', 'select2d'],
            ['zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d'],
            ['zoom2d'],
            ['toImage']
        ],
        
        # Enable crossfilter-style interactions
        'editable': False,
        'staticPlot': False,
    }
    
    # Export with enhanced configuration
    fig.write_html(
        "US500.html",
        config=config,
        include_plotlyjs=True,  # Include Plotly.js for offline use
        div_id="plotly-chart",
        
        # Enhanced HTML template for better embedding
        full_html=True,
        
        # Additional JavaScript for better iframe integration
        post_script="""
        <script>
        // Enhanced iframe integration
        window.addEventListener('message', function(event) {
            if (event.data.type === 'plotly-resize') {
                Plotly.Plots.resize('plotly-chart');
            }
        });
        
        // Auto-resize functionality
        window.addEventListener('resize', function() {
            Plotly.Plots.resize('plotly-chart');
        });
        
        // Better zoom behavior for iframe
        document.getElementById('plotly-chart').on('plotly_relayout', function(eventdata) {
            // Custom zoom handling if needed
            console.log('Chart relayout:', eventdata);
        });
        </script>
        <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        .plotly-graph-div {
            height: 100vh !important;
            width: 100vw !important;
        }
        </style>
        """
    )

# Alternative method with even more control
def create_enhanced_chart_advanced():
    # Your chart creation code here
    fig = go.Figure()
    
    # Add your data here
    
    # Ultra-enhanced configuration
    config = {
        'displayModeBar': True,
        'displaylogo': False,
        'modeBarButtonsToRemove': ['lasso2d', 'select2d'],
        'scrollZoom': True,
        'doubleClick': 'reset+autosize',
        'showTips': True,
        'responsive': True,
        'autosizable': True,
        'frameMargins': 0,
        'plotGlPixelRatio': 2,
        
        # Custom modebar
        'modeBarButtons': [
            [
                {
                    'name': 'Pan',
                    'icon': 'pan',
                    'click': 'function(gd) { Plotly.relayout(gd, {"dragmode": "pan"}); }'
                },
                {
                    'name': 'Zoom',
                    'icon': 'zoom',
                    'click': 'function(gd) { Plotly.relayout(gd, {"dragmode": "zoom"}); }'
                }
            ],
            ['zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d'],
            ['toImage']
        ]
    }
    
    # Custom HTML template for maximum control
    html_template = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Enhanced Plotly Chart</title>
        <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
        <style>
            body, html {
                margin: 0;
                padding: 0;
                height: 100%;
                overflow: hidden;
                font-family: Arial, sans-serif;
            }
            #chart {
                width: 100%;
                height: 100%;
            }
            .modebar {
                background: rgba(255, 255, 255, 0.9) !important;
            }
        </style>
    </head>
    <body>
        <div id="chart"></div>
        <script>
            var config = """ + str(config).replace("'", '"') + """;
            var layout = """ + fig.to_json() + """.layout;
            var data = """ + fig.to_json() + """.data;
            
            // Enhanced layout for iframe
            layout.autosize = true;
            layout.margin = {l: 40, r: 40, t: 40, b: 40};
            layout.responsive = true;
            
            Plotly.newPlot('chart', data, layout, config);
            
            // Enhanced resize handling
            window.addEventListener('resize', function() {
                Plotly.Plots.resize('chart');
            });
            
            // Better iframe communication
            window.addEventListener('message', function(event) {
                if (event.data === 'resize') {
                    Plotly.Plots.resize('chart');
                }
            });
            
            // Enhanced zoom and pan behavior
            document.getElementById('chart').on('plotly_relayout', function(eventdata) {
                // Notify parent frame of layout changes
                if (window.parent !== window) {
                    window.parent.postMessage({
                        type: 'plotly-relayout',
                        data: eventdata
                    }, '*');
                }
            });
        </script>
    </body>
    </html>
    """
    
    with open("US500_enhanced.html", "w") as f:
        f.write(html_template)

if __name__ == "__main__":
    # Use the first method for simpler enhancement
    create_enhanced_chart()
    
    # Or use the second method for maximum control
    # create_enhanced_chart_advanced()
    
    print("Enhanced chart exported successfully!")
    print("Key features added:")
    print("- Better zoom and pan behavior")
    print("- Enhanced responsive design")
    print("- Improved iframe integration")
    print("- Custom toolbar configuration")
    print("- Better resize handling")
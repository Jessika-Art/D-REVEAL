import plotly.graph_objects as go
import plotly.io as pio
from typing import Optional, Dict, Any, List

def save_interactive_chart(
    fig: go.Figure,
    filename: str = "chart.html",
    title: str = "Interactive Chart",
    include_zoom_reset: bool = True,
    include_pan: bool = True,
    include_scroll_zoom: bool = True,
    include_selection_tools: bool = True,
    include_download: bool = True,
    custom_buttons: Optional[List[str]] = None,
    margin_config: Optional[Dict[str, int]] = None,
    responsive: bool = True
) -> None:
    """
    Save a Plotly figure as an interactive HTML file with enhanced functionality.
    
    Parameters:
    -----------
    fig : plotly.graph_objects.Figure
        The Plotly figure to save
    filename : str, default "chart.html"
        Output filename for the HTML file
    title : str, default "Interactive Chart"
        Title for the HTML page
    include_zoom_reset : bool, default True
        Include zoom in/out and reset buttons
    include_pan : bool, default True
        Enable pan functionality
    include_scroll_zoom : bool, default True
        Enable scroll wheel zooming
    include_selection_tools : bool, default True
        Include selection and lasso tools
    include_download : bool, default True
        Include download/export button
    custom_buttons : List[str], optional
        Custom list of toolbar buttons to include
    margin_config : Dict[str, int], optional
        Custom margins (l, r, t, b)
    responsive : bool, default True
        Make chart responsive to container size
    
    Example:
    --------
    import plotly.graph_objects as go
    
    # Create your chart
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=[1, 2, 3, 4], y=[10, 11, 12, 13]))
    
    # Save with enhanced interactivity
    save_interactive_chart(
        fig=fig,
        filename="my_chart.html",
        title="My Enhanced Chart"
    )
    """
    
    # Default margin configuration
    if margin_config is None:
        margin_config = {"l": 50, "r": 50, "t": 50, "b": 50}
    
    # Configure the figure layout for enhanced interactivity
    fig.update_layout(
        # Responsive design
        autosize=True,
        responsive=responsive,
        
        # Margins
        margin=margin_config,
        
        # Default interaction mode
        dragmode='pan' if include_pan else 'zoom',
        
        # Axis configuration for zooming
        xaxis=dict(
            fixedrange=False,  # Allow zooming
            rangeslider=dict(visible=False),  # Hide range slider for cleaner look
        ),
        yaxis=dict(
            fixedrange=False,  # Allow zooming
        ),
        
        # Title configuration
        title=dict(
            text=title,
            x=0.5,  # Center the title
            font=dict(size=16)
        )
    )
    
    # Build toolbar buttons based on parameters
    if custom_buttons is not None:
        mode_bar_buttons = [custom_buttons]
    else:
        mode_bar_buttons = []
        
        # Navigation tools
        nav_tools = []
        if include_pan:
            nav_tools.append('pan2d')
        if include_selection_tools:
            nav_tools.extend(['select2d', 'lasso2d'])
        if nav_tools:
            mode_bar_buttons.append(nav_tools)
        
        # Zoom tools
        zoom_tools = []
        if include_zoom_reset:
            zoom_tools.extend(['zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d'])
        zoom_tools.append('zoom2d')
        if zoom_tools:
            mode_bar_buttons.append(zoom_tools)
        
        # Export tools
        if include_download:
            mode_bar_buttons.append(['toImage'])
    
    # Remove buttons that shouldn't be included
    buttons_to_remove = []
    if not include_selection_tools:
        buttons_to_remove.extend(['lasso2d', 'select2d'])
    
    # Enhanced configuration
    config = {
        # Display settings
        'displayModeBar': True,
        'displaylogo': False,
        'modeBarButtonsToRemove': buttons_to_remove,
        
        # Interaction settings
        'scrollZoom': include_scroll_zoom,
        'doubleClick': 'reset+autosize' if include_zoom_reset else False,
        'showTips': True,
        'responsive': responsive,
        'autosizable': True,
        
        # Toolbar configuration
        'modeBarButtons': mode_bar_buttons if mode_bar_buttons else None,
        
        # Export settings
        'toImageButtonOptions': {
            'format': 'png',
            'filename': filename.replace('.html', ''),
            'height': 700,
            'width': 1000,
            'scale': 2  # High resolution
        },
        
        # Performance settings
        'plotGlPixelRatio': 2,
        'frameMargins': 0,
        
        # Interaction settings
        'editable': False,
        'staticPlot': False,
    }
    
    # Custom JavaScript for enhanced iframe integration
    post_script = f"""
    <script>
        // Enhanced iframe integration and communication
        window.addEventListener('message', function(event) {{
            if (event.data.type === 'plotly-resize') {{
                Plotly.Plots.resize('{title.lower().replace(' ', '-')}-chart');
            }}
        }});
        
        // Auto-resize functionality
        window.addEventListener('resize', function() {{
            Plotly.Plots.resize('{title.lower().replace(' ', '-')}-chart');
        }});
        
        // Enhanced interaction feedback
        document.getElementById('{title.lower().replace(' ', '-')}-chart').on('plotly_relayout', function(eventdata) {{
            // Notify parent frame of layout changes for iframe integration
            if (window.parent !== window) {{
                window.parent.postMessage({{
                    type: 'plotly-relayout',
                    data: eventdata
                }}, '*');
            }}
            
            // Log interaction for debugging (remove in production)
            console.log('Chart interaction:', eventdata);
        }});
        
        // Enhanced zoom behavior
        document.getElementById('{title.lower().replace(' ', '-')}-chart').on('plotly_zoom', function(eventdata) {{
            if (window.parent !== window) {{
                window.parent.postMessage({{
                    type: 'plotly-zoom',
                    data: eventdata
                }}, '*');
            }}
        }});
        
        // Pan behavior
        document.getElementById('{title.lower().replace(' ', '-')}-chart').on('plotly_pan', function(eventdata) {{
            if (window.parent !== window) {{
                window.parent.postMessage({{
                    type: 'plotly-pan',
                    data: eventdata
                }}, '*');
            }}
        }});
    </script>
    
    <style>
        body {{
            margin: 0;
            padding: 10px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #fafafa;
        }}
        
        .plotly-graph-div {{
            height: calc(100vh - 20px) !important;
            width: calc(100vw - 20px) !important;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        
        .modebar {{
            background: rgba(255, 255, 255, 0.95) !important;
            border-radius: 6px !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
        }}
        
        .modebar-btn {{
            transition: all 0.2s ease !important;
        }}
        
        .modebar-btn:hover {{
            background: rgba(99, 102, 241, 0.1) !important;
        }}
        
        /* Custom scrollbar for any overflow */
        ::-webkit-scrollbar {{
            width: 8px;
            height: 8px;
        }}
        
        ::-webkit-scrollbar-track {{
            background: #f1f1f1;
            border-radius: 4px;
        }}
        
        ::-webkit-scrollbar-thumb {{
            background: linear-gradient(45deg, #8b5cf6, #6366f1);
            border-radius: 4px;
        }}
        
        ::-webkit-scrollbar-thumb:hover {{
            background: linear-gradient(45deg, #7c3aed, #4f46e5);
        }}
    </style>
    """
    
    # Export the figure with all enhancements
    fig.write_html(
        filename,
        config=config,
        include_plotlyjs=True,  # Include Plotly.js for offline use
        div_id=f"{title.lower().replace(' ', '-')}-chart",
        full_html=True,
        post_script=post_script
    )
    
    print(f"✅ Enhanced interactive chart saved as: {filename}")
    print(f"📊 Features enabled:")
    print(f"   • Scroll to zoom: {'✓' if include_scroll_zoom else '✗'}")
    print(f"   • Pan functionality: {'✓' if include_pan else '✗'}")
    print(f"   • Zoom controls: {'✓' if include_zoom_reset else '✗'}")
    print(f"   • Selection tools: {'✓' if include_selection_tools else '✗'}")
    print(f"   • Download option: {'✓' if include_download else '✗'}")
    print(f"   • Responsive design: {'✓' if responsive else '✗'}")


# Convenience function for quick exports with default settings
def quick_save_chart(fig: go.Figure, filename: str = "chart.html") -> None:
    """
    Quick save with all interactive features enabled.
    
    Parameters:
    -----------
    fig : plotly.graph_objects.Figure
        The Plotly figure to save
    filename : str, default "chart.html"
        Output filename
    """
    save_interactive_chart(fig, filename)


# Example usage function
def example_usage():
    """
    Example of how to use the save_interactive_chart function.
    """
    # Create a sample chart
    import numpy as np
    
    # Sample data
    x = np.linspace(0, 10, 100)
    y1 = np.sin(x)
    y2 = np.cos(x)
    
    # Create figure
    fig = go.Figure()
    
    # Add traces
    fig.add_trace(go.Scatter(
        x=x, y=y1,
        mode='lines',
        name='Sin(x)',
        line=dict(color='blue', width=2)
    ))
    
    fig.add_trace(go.Scatter(
        x=x, y=y2,
        mode='lines',
        name='Cos(x)',
        line=dict(color='red', width=2)
    ))
    
    # Save with full interactivity
    save_interactive_chart(
        fig=fig,
        filename="example_chart.html",
        title="Trigonometric Functions"
    )
    
    # Or use quick save
    # quick_save_chart(fig, "quick_example.html")


if __name__ == "__main__":
    # Run example
    example_usage()
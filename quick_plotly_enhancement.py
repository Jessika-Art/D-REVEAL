# Quick enhancement for your existing script
# Add this configuration when you call fig.write_html()

# Enhanced configuration for better iframe embedding
config = {
    'displayModeBar': True,
    'displaylogo': False,
    'scrollZoom': True,           # Enable scroll to zoom
    'doubleClick': 'reset',       # Double-click to reset
    'showTips': True,
    'responsive': True,
    'autosizable': True,
    
    # Remove unnecessary buttons for cleaner interface
    'modeBarButtonsToRemove': ['lasso2d'],
    
    # Enhanced zoom behavior
    'toImageButtonOptions': {
        'format': 'png',
        'filename': 'chart',
        'height': 500,
        'width': 700,
        'scale': 1
    }
}

# Enhanced layout for your figure
fig.update_layout(
    autosize=True,
    responsive=True,
    margin=dict(l=40, r=40, t=40, b=40),  # Better margins
    dragmode='pan',  # Default to pan mode
    xaxis=dict(fixedrange=False),  # Allow zooming on X-axis
    yaxis=dict(fixedrange=False),  # Allow zooming on Y-axis
)

# Export with enhanced settings
fig.write_html(
    "US500.html",
    config=config,
    include_plotlyjs=True,  # Include Plotly.js for offline use
    div_id="plotly-chart"
)
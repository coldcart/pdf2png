# PDF to PNG Converter Azure Function

This project contains an Azure Function that converts PDF files to PNG images. It uses the `pdf-to-png-converter` library to perform the conversion.

## Features

- Converts a single-page PDF to a PNG image
- Accepts PDF URL as input
- Returns the converted PNG image directly in the response
- Renders image in browser
- Returns image as byte array

## Prerequisites

- Node.js
- Azure Functions Core Tools
- Azure subscription (for deployment)

## Setup

1. Clone this repository
2. Install dependencies:   ```
   npm install   ```
3. Set up your local.settings.json file with necessary configuration

## Usage

The function is accessible via HTTP GET request. The PDF URL should be provided as part of the route.

Example URL:

```
https://localhost:7071/api/pdf2png/https://example.com/sample.pdf
```

## Configuration

The PDF to PNG conversion uses the following settings:

- Viewport Scale: default 5.0, or configurable with `VIEWPORT_SCALE` environment variable
- Pages to Process: [1] (assumes single-page PDF)
- Verbosity Level: 1
- Font Face: Enabled
- System Fonts: Disabled
- XFA: Enabled
- Strict Pages to Process: Enabled

## Response

- **Success**: Returns the PNG image with appropriate headers
- **Failure**: Returns a JSON object with an error message and a 400 status code

## Error Handling

The function includes error handling for:
- Invalid or missing PDF URL
- Conversion failures

## Deployment

Deploy this function to Azure using the Azure Functions Core Tools or Azure CLI. Make sure to configure any necessary application settings in your Azure Function App.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

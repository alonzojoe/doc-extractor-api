const config = require('../config')

class MistralService {
  constructor() {
    this.apiKey = config.mistralApiKey
    this.baseUrl = 'https://api.mistral.ai/v1'
    this.model = 'pixtral-12b-2409'
  }

  async extractFromText(text) {
    const prompt = this.buildExtractionPrompt(text)
    
    const messages = [
      {
        role: 'system',
        content: 'You are a document extraction AI. Extract structured data from documents and return ONLY valid JSON. Do not include any explanation or markdown formatting.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]

    const response = await this.callMistralAPI(messages)
    return this.parseResponse(response)
  }

  buildExtractionPrompt(text) {
    return `Extract all relevant information from the following document and return it as a JSON object.
            Document content:
            ${text}
            Please extract:
            - Document type (invoice, receipt, contract, etc.)
            - All key fields (dates, amounts, names, addresses, table, etc.)
            - Line items if present
            - Any other relevant information

            Return the data in this JSON format:
            {
            "documentType": "type_here",
            "extractedFields": {
                // all extracted fields here
            },
            "confidence": 0.95
            }
            Return ONLY the JSON object, no other text.`
  }

  async callMistralAPI(messages) {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.1,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Mistral API error: ${error.message || response.statusText}`)
    }

    return response.json()
  }

  parseResponse(response) {
    const content = response.choices[0]?.message?.content
    
    if (!content) {
      throw new Error('No content in Mistral response')
    }

    try {
      const cleanContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()

      const parsed = JSON.parse(cleanContent)
      
      if (!parsed.extractedFields) {
        throw new Error('Invalid response format: missing extractedFields')
      }

      return parsed
    } catch (error) {
      console.error('Failed to parse Mistral response:', content)
      throw new Error(`Failed to parse extraction result: ${error.message}`)
    }
  }
}

module.exports = MistralService
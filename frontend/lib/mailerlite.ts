/**
 * MailerLite API Service
 * Replicates the Django MailerLiteService functionality
 */

interface MailerLiteSubscriber {
  data: {
    id: string
    email: string
    [key: string]: any
  }
}

interface MailerLiteResponse {
  data?: any
  [key: string]: any
}

class MailerLiteService {
  private apiKey: string | undefined
  private baseUrl = 'https://connect.mailerlite.com/api'

  constructor() {
    this.apiKey = process.env.MAILERLITE_API_KEY
  }

  private async makeRequest(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<MailerLiteResponse | null> {
    if (!this.apiKey) {
      console.error('MailerLite API key not configured')
      return null
    }

    const url = `${this.baseUrl}/${endpoint}`
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    try {
      const options: RequestInit = {
        method,
        headers,
      }

      if (data) {
        options.body = JSON.stringify(data)
      }

      const response = await fetch(url, options)

      if (response.status === 200 || response.status === 201) {
        return await response.json()
      } else if (response.status === 404) {
        console.warn(`MailerLite API endpoint not found: ${endpoint}`)
        return null
      } else if (response.status === 401) {
        console.error('MailerLite API authentication failed - check your API key')
        return null
      } else if (response.status === 403) {
        console.error('MailerLite API access forbidden - check API key permissions')
        return null
      } else {
        const errorText = await response.text()
        console.error(`MailerLite API error: ${response.status} - ${errorText}`)
        return null
      }
    } catch (error) {
      console.error(`MailerLite API request failed: ${error}`)
      return null
    }
  }

  async getSubscriber(email: string): Promise<MailerLiteSubscriber | null> {
    const endpoint = `subscribers/${email}`
    return (await this.makeRequest('GET', endpoint)) as MailerLiteSubscriber | null
  }

  async createSubscriber(
    email: string,
    groupId: string | null,
    firstName?: string
  ): Promise<MailerLiteResponse | null> {
    const endpoint = 'subscribers'
    const data: any = {
      email,
    }

    if (groupId) {
      data.groups = [groupId]
    }

    if (firstName) {
      data.fields = {
        name: firstName,
      }
    }

    return await this.makeRequest('POST', endpoint, data)
  }

  async updateSubscriber(
    email: string,
    options: {
      firstName?: string
      usesAutomationInTheirBusiness?: number
      sellsAIServices?: number
    }
  ): Promise<MailerLiteResponse | null> {
    // First get the subscriber to find their ID
    const subscriber = await this.getSubscriber(email)
    if (!subscriber) {
      console.error(`Subscriber not found: ${email}`)
      return null
    }

    const subscriberId = subscriber.data?.id
    if (!subscriberId) {
      console.error(`No ID found for subscriber: ${email}`)
      return null
    }

    const endpoint = `subscribers/${subscriberId}`
    const data: any = {}

    if (options.firstName) {
      data.fields = {
        name: options.firstName,
      }
    }

    if (options.usesAutomationInTheirBusiness !== undefined) {
      if (!data.fields) {
        data.fields = {}
      }
      data.fields.uses_automation_in_their_business = options.usesAutomationInTheirBusiness
    }

    if (options.sellsAIServices !== undefined) {
      if (!data.fields) {
        data.fields = {}
      }
      data.fields.sell_ai_services = options.sellsAIServices
    }

    if (Object.keys(data).length === 0) {
      return null
    }

    return await this.makeRequest('PUT', endpoint, data)
  }

  async addSubscriberToGroup(
    email: string,
    groupId: string
  ): Promise<MailerLiteResponse | null> {
    const endpoint = `subscribers/${email}/groups/${groupId}`
    return await this.makeRequest('POST', endpoint)
  }
}

export default MailerLiteService

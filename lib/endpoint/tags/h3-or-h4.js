const _ = require('lodash')
const cheerio = require('cheerio')

const commonTitles = [
  'Request',
  'Response',
  'Example'
]

const descriptionTitles = [
  'The verification object',
  'The reason field',
  'Import status',
  'The project_choices field',
  'Git LFS related fields',
  'Understanding Your Rate Limit Status',
  'Object attributes',
  'OAuth scope requirements',
  'Rate limits',
  'Working with large comparisons',
  'Filter parameter',
  'Highlighting repository search results',
  'Considerations for commit search',
  'Highlighting code search results',
  'Considerations for code search',
  'Highlighting issue search results',
  'Highlighting user search results',
  'Highlighting topic search results',
  'Highlighting label search results'
]

const alternativeResponseTitles = [
  'Reactions summary',
  'Client Errors',
  'Issue comments created by users via integrations',
  'Issues opened by users via integrations',
  'Issue events triggered by users via integrations',
  'Parameters for updating project choice',
  'Parameters for restarting import',
  'Deployments created by users via integrations',
  'Failed commit status checks',
  'Deployment statuses created by users via integrations'
]

module.exports = {
  is (el) {
    return cheerio(el).is('h3, h4')
  },
  parse (el) {
    const $el = cheerio(el)
    const text = $el.text().replace(/\s+/g, ' ').trim()

    if (commonTitles.includes(text)) {
      return {
        type: `${_.camelCase(text)}Header`,
        text
      }
    }

    if (descriptionTitles.includes(text)) {
      return {
        type: `description`,
        text: `**${text}**`
      }
    }

    if (text.toLowerCase() === 'alternative input') {
      return {
        type: 'alternativeParametersHeader',
        text
      }
    }

    if (text.toLowerCase() === 'optional parameters') {
      return {
        type: 'optionalParametersHeader',
        text
      }
    }

    if (/^((body )?parameters|input)/i.test(text)) {
      // TODO: Handle alternative responses
      return {
        type: `parametersHeader`,
        text
      }
    }

    if (alternativeResponseTitles.includes(text) || /\bresponse\b/i.test(text)) {
      // TODO: Handle alternative responses
      return {
        type: `alternativeResponseHeader`,
        text
      }
    }

    if (/^(Simple|Advanced)? ?Example/i.test(text)) {
      // TODO: Handle alternative responses
      return {
        type: `exampleHeader`,
        text
      }
    }

    if (/^(Stubbed endpoint)$/.test(text)) {
      // TODO: Handle alternative responses
      return {
        type: `alternativeRouteHeader`,
        text
      }
    }

    if (/^Deprecation notice/i.test(text)) {
      // TODO: Handle response descriptions
      return {
        type: `DeprecationHeader`,
        text
      }
    }
  }
}

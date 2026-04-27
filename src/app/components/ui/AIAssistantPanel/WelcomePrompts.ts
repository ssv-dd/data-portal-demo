/**
 * Rotating welcome lines for the AI assistant. Pass the user's first name from
 * `useAppContext().currentUser?.name?.first_name` (see `SearchGreeting`).
 */
export function getWelcomePrompts(firstName: string): readonly string[] {
  const name = firstName.trim() || 'there'

  return [
    `How can I help you today, ${name}?`,
    `Welcome back, ${name} — what would you like to explore?`,
    `Hey ${name} 👋 What can I assist you with right now?`,
    `Good to see you, ${name}. How can I make things easier today?`,
    `Hi ${name}! Ready when you are — what do you need help with?`,
    `${name}, what are we solving today?`,
    `Welcome, ${name} ✨ Let’s get something done — how can I help?`,
    `Back again, ${name}? I’m here to help — what’s up?`,
    `Hey ${name} — need quick help or deep thinking today?`,
    `Hi ${name}! Tell me what you’re working on.`,
  ]
}

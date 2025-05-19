import type { Joke, JokeType } from '@/types/Joke.ts'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'

/**
 * Composable for handling joke form validation and creation
 * @returns Form utilities and methods for joke creation
 */
export function useJokeForm() {
  // Define form validation schema
  const formSchema = toTypedSchema(z.object({
    setup: z
      .string()
      .min(3, { message: 'Setup must be at least 3 characters.' })
      .max(50, { message: 'Setup must not exceed 50 characters.' }),
    punchline: z
      .string()
      .min(10, { message: 'Punchline text must be at least 10 characters.' })
      .max(500, { message: 'Punchline text must not exceed 500 characters.' }),
    category: z.string({ required_error: 'Please select a category.' }),
  }))

  // Initialize a form with validation schema
  const form = useForm({
    validationSchema: formSchema,
  })

  /**
   * Creates a new joke object from form values
   * @param values - The form values
   * @returns A new joke object
   */
  const createJoke = (values: { setup: string, punchline: string, category: string }): Joke => {
    return {
      id: Date.now(),
      type: values.category as JokeType,
      setup: values.setup,
      punchline: values.punchline,
      isLiked: true,
    }
  }

  return {
    form,
    createJoke,
  }
}

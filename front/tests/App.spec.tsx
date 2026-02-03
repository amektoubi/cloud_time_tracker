
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-react'
import App from '../src/App'

test('renders page', async () => {
  const { getByText, getByRole } = await render(<App />)

  await expect.element(getByText('Vite + React')).toBeInTheDocument()
  await getByRole('button', { name: 'count is 0' }).click()

  await expect.element(getByText('count is 1')).toBeInTheDocument()
})


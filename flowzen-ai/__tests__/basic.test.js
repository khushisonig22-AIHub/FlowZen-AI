import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Dashboard from '../app/dashboard/page'

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders dashboard with user data', async () => {
    const mockUser = { id: '1', name: 'John Doe' }
    const mockBookings = [
      {
        id: '1',
        userId: '1',
        eventName: 'Concert A',
        date: '2024-01-01',
        time: '20:00',
        status: 'confirmed',
        qrCode: 'qr123',
      },
    ]

    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'flowzen_current_user') return JSON.stringify(mockUser)
      if (key === 'flowzen_bookings') return JSON.stringify(mockBookings)
      return null
    })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('Welcome back,')).toBeInTheDocument()
    })
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Live bookings')).toBeInTheDocument()
    expect(screen.getByText('Concert A')).toBeInTheDocument()
  })

  test('shows empty state when no bookings', async () => {
    const mockUser = { id: '1', name: 'John Doe' }

    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'flowzen_current_user') return JSON.stringify(mockUser)
      if (key === 'flowzen_bookings') return JSON.stringify([])
      return null
    })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('No bookings found')).toBeInTheDocument()
    })
    expect(screen.getByText('Create your first booking to enable crowd monitoring and smart alerts.')).toBeInTheDocument()
  })

  test('handles logout correctly', async () => {
    const mockUser = { id: '1', name: 'John Doe' }

    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'flowzen_current_user') return JSON.stringify(mockUser)
      if (key === 'flowzen_bookings') return JSON.stringify([])
      return null
    })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('No bookings found')).toBeInTheDocument()
    })

    const logoutButton = screen.getByText('Logout')
    fireEvent.click(logoutButton)

    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('flowzen_current_user')
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  test('cancel booking functionality works', async () => {
    const mockUser = { id: '1', name: 'John Doe' }
    const mockBookings = [
      {
        id: '1',
        userId: '1',
        eventName: 'Concert A',
        date: '2024-01-01',
        time: '20:00',
        status: 'confirmed',
        qrCode: 'qr123',
      },
    ]

    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'flowzen_current_user') return JSON.stringify(mockUser)
      if (key === 'flowzen_bookings') return JSON.stringify(mockBookings)
      return null
    })

    // Mock window.confirm
    window.confirm = jest.fn(() => true)

    render(<Dashboard />)

    const cancelButton = screen.getByRole('button', { name: /cancel booking for concert a/i })
    fireEvent.click(cancelButton)

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to cancel this booking?')
      expect(mockLocalStorage.setItem).toHaveBeenCalled()
    })

    // Check that the booking status was updated
    const setItemCall = mockLocalStorage.setItem.mock.calls.find(call => call[0] === 'flowzen_bookings')
    const updatedBookings = JSON.parse(setItemCall[1])
    expect(updatedBookings[0].status).toBe('cancelled')
  })

  test('redirects to login if no user', async () => {
    mockLocalStorage.getItem.mockReturnValue(null)

    render(<Dashboard />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })
})
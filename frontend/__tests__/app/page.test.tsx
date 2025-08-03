import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home Page', () => {
  it('renders the environment test success message', () => {
    render(<Home />)
    
    // 測試是否顯示 Docker 環境測試成功的訊息
    const successMessage = screen.getByText(/Docker 環境測試成功/)
    expect(successMessage).toBeInTheDocument()
  })

  it('renders with green success banner', () => {
    const { container } = render(<Home />)
    
    // 測試是否有綠色背景的橫幅
    const banner = container.querySelector('.bg-green-100')
    expect(banner).toBeInTheDocument()
    expect(banner).toHaveClass('bg-green-100')
  })
})
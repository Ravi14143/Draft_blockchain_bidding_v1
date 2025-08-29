import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import blockchain_loading from '@/assets/blockchain_loading.png'
import main_login from '@/assets/main_login.png'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, EyeOff } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useRef, useEffect } from 'react'

const API_BASE_URL = 'http://127.0.0.1:5000'

export default function Login({ setUser }) {
  // Default login username is 'owner1'; you can change as needed
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [registerData, setRegisterData] = useState({ username: '', password: '', role: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',  // important for session cookies
        body: JSON.stringify(loginData),
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!registerData.role) {
      setError('Please select a role')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(registerData),
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Registration failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Optional: quick-fill demo credentials
  const fillDemoCredentials = (role = 'owner') => {
    const demoMap = {
      owner: { username: 'owner1', password: 'password123' },
      bidder: { username: 'bidder1', password: 'password123' },
      admin: { username: 'admin1', password: 'password123' },
    }
    setLoginData(demoMap[role] || demoMap.owner)
    setError('')
  }

  const loading_blockchain_ref = useRef()

  // useGSAP(() => {
  //   gsap.to(loading_blockchain_ref.current, {
  //     rotation: 360,
  //     duration: 12,
  //     repeat: -1,
  //     ease: 'linear',
  //   })
  // })

  useGSAP(() => {
    gsap.to(loading_blockchain_ref.current, {
      y: -30,
      duration: 1.5, 
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-yellow-300">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div ref={loading_blockchain_ref} className='flex justify-center items-center mt-8'>
            <img src={main_login} width={200} height={200} alt="Blockchain Loading" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Blockchain Bidding Platform
          </CardTitle>
          <CardDescription>
            Secure, transparent, and AI-powered bidding system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mt-1'></div>
          <Tabs defaultValue="login" className="w-full" >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>


            {/* forceMount
  className="
    overflow-hidden transition-all duration-500
    data-[state=inactive]:max-h-0 data-[state=inactive]:opacity-0
    data-[state=active]:max-h-[500px] data-[state=active]:opacity-100
  " */}

  <TabsContent value="login" >

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2 space-x-2 my-4">
                  <Label htmlFor="login-username">Username</Label>
                  <Input
                    id="login-username"
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2 space-x-2 my-4">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      {showLoginPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Demo credentials quick-fill */}
                {/* <div className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={() => fillDemoCredentials('owner')}>
                    Fill Owner Demo
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => fillDemoCredentials('bidder')}>
                    Fill Bidder Demo
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => fillDemoCredentials('admin')}>
                    Fill Admin Demo
                  </Button>
                </div> */}

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button type="submit" className="w-full mt-4" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>

              </TabsContent>


              <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2 my-4">
                  <Label htmlFor="register-username">Username</Label>
                  <Input
                    id="register-username"
                    type="text"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2 my-4">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showRegisterPassword ? "text" : "password"}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    >
                      {showRegisterPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2 my-4">
                  <Label htmlFor="register-role">Role</Label>
                  <Select
                    onValueChange={(value) => setRegisterData({ ...registerData, role: value })}
                    value={registerData.role}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Project Owner</SelectItem>
                      <SelectItem value="bidder">Bidder / Contractor</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button type="submit" className="w-full mt-4" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
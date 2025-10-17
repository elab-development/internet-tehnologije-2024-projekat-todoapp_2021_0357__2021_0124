import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import * as authService from '../services/authService';
import { useAuth } from '../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validacija potvrde lozinke
    if (password !== confirmPassword) {
      setError('Lozinke se ne poklapaju.');
      return;
    }

    try {
      const response = await authService.register({ 
        name, 
        email, 
        password, 
        password_confirmation: confirmPassword 
      });
      
      console.log('Register response:', response);
      console.log('Response data:', response.data);
      
      if (response.data && response.data.user && response.data.token) {
        // Automatski prijavi korisnika nakon registracije
        auth.login(response.data.user, response.data.token);
        navigate('/app');
      } else {
        setError('Neočekivani odgovor od servera.');
      }
    } catch (err: any) {
      console.error('Register error:', err);
      console.error('Error response:', err.response);
      
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Registracija neuspešna. Proverite podatke.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Kreirajte novi nalog
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Ime"
              type="text"
              placeholder="Ime"
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="name"
            />
            <Input
              label="Email adresa"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
            />
            <Input
              label="Lozinka"
              type="password"
              placeholder="Lozinka"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
            />
            <Input
              label="Potvrda lozinke"
              type="password"
              placeholder="Potvrda lozinke"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              name="password_confirmation"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <Button type="submit">
              Registruj se
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
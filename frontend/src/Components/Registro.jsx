import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Registro = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('usuario');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (contrasena !== confirmarContrasena) {
    setError('Las contraseñas no coinciden');
    return;
  }

  try {
    const res = await fetch('http://localhost:3001/api/usuario/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: usuario, clave: contrasena, tipoUsuario }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.mensaje || 'Registro exitoso');  // <-- Aquí es el único cambio
      navigate('/');
    } else {
      setError(data.error || 'Error al registrar usuario');
    }
  } catch (error) {
    setError('Error de conexión con el servidor');
  }
};

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Formulario de Registro</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <select
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
              required
            >
              <option value="usuario">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Registrar</button>
        </form>

        <button className="volver-btn" onClick={() => navigate('/')}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default Registro;








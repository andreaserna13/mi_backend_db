import React, { useState } from 'react';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('usuario'); // o 'admin'
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3000/api/auth/login', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, clave, tipoUsuario })
    });

    const data = await response.json();

    if(data.exito) {
      setMensaje(`Bienvenido ${tipoUsuario}`);
      // Aquí puedes guardar token o hacer redirección
    } else {
      setMensaje(data.mensaje);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Usuario" 
        value={usuario} 
        onChange={e => setUsuario(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Clave" 
        value={clave} 
        onChange={e => setClave(e.target.value)} 
      />
      <select value={tipoUsuario} onChange={e => setTipoUsuario(e.target.value)}>
        <option value="usuario">Usuario</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Ingresar</button>
      <p>{mensaje}</p>
    </form>
  );
}

export default Login;




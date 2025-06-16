// src/service/useService.js

export async function registrarUsuario(nombre, correo, clave, tipoUsuario) {
  try {
    const respuesta = await fetch('http://localhost:3001/api/auth/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre,
        correo,
        clave,
        tipoUsuario,
      }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      return {
        exito: false,
        mensaje: datos.mensaje || 'Error en el registro',
      };
    }

    return {
      exito: true,
      mensaje: datos.mensaje || 'Registro exitoso',
      usuario: datos.usuario,
    };
  } catch (error) {
    console.error('Error en registrarUsuario:', error);
    return {
      exito: false,
      mensaje: 'No se pudo conectar al servidor',
    };
  }
}


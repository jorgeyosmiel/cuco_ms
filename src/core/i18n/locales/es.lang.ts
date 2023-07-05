const lang = new Map<string, string>();

lang.set('SUCCESS', 'exitoso.');
lang.set('UNKNOWN', 'desconocido.');
lang.set('INVALID', 'inválido.');
lang.set('SYSTEM_GENERAL_ERROR', 'error general del sistema.');
lang.set('DATABASE_ERROR', 'error de base de datos.');
lang.set('INVALID_HEADERS', 'encabezados no válidos.');
lang.set('SYNTAX_ERROR', 'error de sintaxis.');
lang.set('NOT_FOUND', 'no encontrado.');
lang.set('DATABASE_CONNECTION_ERROR', 'error de conexión a la base de datos.');
lang.set('INSERT_ERROR', 'error de inserción.');
lang.set('UPDATE_ERROR', 'error de actualización);');
lang.set('DELETE_ERROR', 'erro de eliminación.');
lang.set('RECORD_NOT_FOUND', 'elemento no encontrado.');
lang.set('PERMISSION_DENIED', 'permiso denegado.');
lang.set('AUTH_LOGIN_FAIL', 'Login fallido.');
lang.set('AUTH_INVALID_TOKEN', 'token no válido.');
lang.set('AUTH_MISSING_JWT', 'falta el jwt.');
lang.set('AUTH_DELETED_ACCOUNT', 'cuenta eliminada.');
lang.set('AUTH_DISABLED_ACCOUNT', 'cuenta desactivada.');
lang.set('AUTH_EXPIRED_TOKEN', 'token caducado.');
lang.set(
  'AUTH_INVALID_EMAIL_ADDRESS',
  'dirección de correo electrónico no válida.',
);
lang.set('AUTH_INVALID_PASSWORD', 'contraseña inválida.');
lang.set(
  'NEW_PASSWORD_SAME_AS_CURRENT_PASSWORD',
  'nueva contraseña igual que la actual.',
);
lang.set('NON_ACTIVATED_ACCOUNT', 'cuenta no activada.');
lang.set('OTP_LIMIT_REACHED', 'límite de otp alcanzado.');
lang.set('USER_NOT_FOUND', 'usuario no encontrado.');
lang.set('TOKEN_NOT_FOUND', 'token no encontrado.');

const esLangs = lang;
export default esLangs;

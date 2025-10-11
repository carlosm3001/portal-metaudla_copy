-- ====================================================================
-- PASO 0: BORRAR TABLAS EXISTENTES EN EL ORDEN CORRECTO
-- ====================================================================
DROP TABLE IF EXISTS proyecto_imagenes;
DROP TABLE IF EXISTS proyectos_tecnologias;
DROP TABLE IF EXISTS calificaciones;
DROP TABLE IF EXISTS comentarios;
DROP TABLE IF EXISTS auditoria_acciones;
DROP TABLE IF EXISTS proyectos;
DROP TABLE IF EXISTS tecnologias;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS usuarios;


-- ====================================================================
-- PASO 1: Crear todas las tablas sin claves externas
-- ====================================================================

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'user', 'student', 'teacher') DEFAULT 'user',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(191) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tecnologias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(191) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS proyectos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    imagenUrl VARCHAR(255), -- Imagen principal/portada
    githubUrl VARCHAR(255),
    websiteUrl VARCHAR(255),
    categoria_id INT,
    participantes TEXT,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    vistas INT DEFAULT 0,
    calificacion_promedio DECIMAL(3, 2) DEFAULT 0.00,
    cantidad_calificaciones INT DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS proyecto_imagenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proyecto_id INT NOT NULL,
    imagenUrl VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS proyectos_tecnologias (
    proyecto_id INT,
    tecnologia_id INT,
    PRIMARY KEY (proyecto_id, tecnologia_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS auditoria_acciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    accion VARCHAR(255) NOT NULL,
    detalles TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comentario TEXT NOT NULL,
    proyecto_id INT NOT NULL,
    usuario_id INT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS calificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    calificacion INT NOT NULL,
    proyecto_id INT NOT NULL,
    usuario_id INT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_proyecto_usuario (proyecto_id, usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ====================================================================
-- PASO 2: Añadir todas las claves externas
-- ====================================================================

ALTER TABLE proyectos
ADD FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL;

ALTER TABLE proyecto_imagenes
ADD FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE;

ALTER TABLE proyectos_tecnologias
ADD FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE;

ALTER TABLE proyectos_tecnologias
ADD FOREIGN KEY (tecnologia_id) REFERENCES tecnologias(id) ON DELETE CASCADE;

ALTER TABLE auditoria_acciones
ADD FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL;

ALTER TABLE comentarios
ADD FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE;

ALTER TABLE comentarios
ADD FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL;

ALTER TABLE calificaciones
ADD FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE;

ALTER TABLE calificaciones
ADD FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL;
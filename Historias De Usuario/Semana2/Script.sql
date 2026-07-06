CREATE DATABASE gestion_academica_universidad;

CREATE TABLE estudiantes (
    id_estudiante SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    genero CHAR(1) NOT NULL CHECK (genero IN ('M','F')),
    identificacion VARCHAR(20) NOT NULL UNIQUE,
    carrera VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    fecha_ingreso DATE NOT NULL
);

CREATE TABLE docentes (
    id_docente SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    correo_institucional VARCHAR(100) NOT NULL UNIQUE,
    departamento_academico VARCHAR(100) NOT NULL,
    anios_experiencia INT NOT NULL CHECK(anios_experiencia >= 0)
);

CREATE TABLE cursos (
    id_curso SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    creditos INT NOT NULL CHECK(creditos BETWEEN 1 AND 6),
    semestre INT NOT NULL CHECK(semestre BETWEEN 1 AND 10),
    id_docente INT,
    FOREIGN KEY(id_docente)
        REFERENCES docentes(id_docente)
        ON DELETE SET NULL
);

CREATE TABLE inscripciones (
    id_inscripcion SERIAL PRIMARY KEY,
    id_estudiante INT NOT NULL,
    id_curso INT NOT NULL,
    fecha_inscripcion DATE NOT NULL,
    calificacion_final NUMERIC(4,2)
        CHECK(calificacion_final BETWEEN 0 AND 5),

    FOREIGN KEY(id_estudiante)
        REFERENCES estudiantes(id_estudiante)
        ON DELETE CASCADE,

    FOREIGN KEY(id_curso)
        REFERENCES cursos(id_curso)
        ON DELETE CASCADE
);

INSERT INTO docentes (nombre_completo, correo_institucional, departamento_academico, anios_experiencia)
VALUES
('Carlos Pérez', 'cperez@universidad.edu', 'Ingeniería', 10),
('María Gómez', 'mgomez@universidad.edu', 'Matemáticas', 8),
('Luis Rodríguez', 'lrodriguez@universidad.edu', 'Sistemas', 4);

INSERT INTO estudiantes
(nombre_completo, correo_electronico, genero, identificacion, carrera, fecha_nacimiento, fecha_ingreso)
VALUES
('Juan Camilo Gale', 'juan@correo.com', 'M', '100000001', 'Ingeniería de Sistemas', '2005-01-15', '2024-01-20'),
('Laura Martínez', 'laura@correo.com', 'F', '100000002', 'Ingeniería Industrial', '2004-06-10', '2024-01-20'),
('Andrés López', 'andres@correo.com', 'M', '100000003', 'Ingeniería de Sistemas', '2003-03-05', '2023-07-15'),
('Sofía Ramírez', 'sofia@correo.com', 'F', '100000004', 'Administración', '2004-11-02', '2024-01-20'),
('Miguel Torres', 'miguel@correo.com', 'M', '100000005', 'Contaduría', '2002-08-20', '2022-07-15');

INSERT INTO cursos
(nombre, codigo, creditos, semestre, id_docente)
VALUES
('Bases de Datos', 'BD101', 4, 3, 3),
('Programación Web', 'PW201', 4, 4, 1),
('Cálculo II', 'CAL202', 3, 2, 2),
('Ingeniería de Software', 'IS301', 4, 5, 1);

INSERT INTO inscripciones
(id_estudiante, id_curso, fecha_inscripcion, calificacion_final)
VALUES
(1,1,'2026-01-15',4.5),
(1,2,'2026-01-15',4.8),
(2,2,'2026-01-15',3.9),
(3,1,'2026-01-15',4.2),
(3,3,'2026-01-15',4.0),
(4,3,'2026-01-15',3.5),
(5,4,'2026-01-15',4.7),
(5,1,'2026-01-15',4.1);


SELECT e.nombre_completo,
       c.nombre AS curso,
       i.fecha_inscripcion,
       i.calificacion_final
FROM estudiantes e
JOIN inscripciones i
ON e.id_estudiante = i.id_estudiante
JOIN cursos c
ON c.id_curso = i.id_curso;

SELECT c.nombre,
       d.nombre_completo,
       d.anios_experiencia
FROM cursos c
JOIN docentes d
ON c.id_docente = d.id_docente
WHERE d.anios_experiencia > 5;

SELECT c.nombre,
       ROUND(AVG(i.calificacion_final),2) AS promedio
FROM cursos c
JOIN inscripciones i
ON c.id_curso = i.id_curso
GROUP BY c.nombre;

SELECT e.nombre_completo,
       COUNT(*) AS cantidad_cursos
FROM estudiantes e
JOIN inscripciones i
ON e.id_estudiante = i.id_estudiante
GROUP BY e.nombre_completo
HAVING COUNT(*) > 1;

ALTER TABLE estudiantes
ADD COLUMN estado_academico VARCHAR(20);

DELETE FROM docentes
WHERE id_docente = 1;

SELECT *
FROM cursos;

SELECT c.nombre,
       COUNT(i.id_estudiante) AS estudiantes_inscritos
FROM cursos c
JOIN inscripciones i
ON c.id_curso = i.id_curso
GROUP BY c.nombre
HAVING COUNT(i.id_estudiante) > 2;
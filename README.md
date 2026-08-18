# Command Center Console

Quiero construir el frontend de un sistema privado llamado “Command Center”, destinado a dirigir una incubadora de aplicaciones operada principalmente mediante agentes de IA.



Usa la imagen adjunta como referencia visual principal. Replica su nivel de organización, jerarquía, elegancia y estilo general, pero construye una interfaz real, responsive, reutilizable y preparada para conectarse posteriormente con nuestro backend.



IMPORTANTE



No construyas una landing page. Construye una aplicación SaaS privada de operaciones internas.



OBJETIVO DEL PRODUCTO



La empresa es una incubadora de apps. Actualmente existen tres aplicaciones próximas al lanzamiento, pero el sistema debe soportar un número ilimitado de productos en el futuro.



El flujo general de cada producto es:



Idea → Inteligencia → Validación → Diseño → Desarrollo → QA → Lanzamiento → Crecimiento → Venta



Solo existen inicialmente dos operadoras humanas:



CEO/fundador: supervisa estrategia, producto, tecnología, finanzas y decisiones importantes.

Directora de distribución: supervisa comunidad, contenido, marketing, distribución y crecimiento.



Los agentes de IA ejecutarán tareas especializadas cuando sean activados por horarios, eventos o aprobaciones. No son personajes permanentemente activos.



IDENTIDAD VISUAL



Crear una estética premium de “mission control” empresarial:



Fondo azul marino/negro carbón.

Paneles oscuros con profundidad sutil.

Bordes finos y discretos.

Azul eléctrico como color principal.

Violeta para NOVA, inteligencia y distribución.

Verde únicamente para estados saludables o completados.

Ámbar para advertencias.

Rojo para errores, riesgos o acciones destructivas.

Tipografía moderna, profesional y muy legible.

Mucho espacio visual y excelente jerarquía.

Animaciones suaves y rápidas.

Nada de hologramas exagerados.

Nada de elementos decorativos innecesarios.

Nada de gráficos falsos sin una función.

Debe sentirse sofisticado, limpio, confiable y preparado para una empresa de alto nivel.



IDIOMA



Toda la interfaz debe estar inicialmente en español. Prepara la arquitectura para internacionalización futura.



ESTRUCTURA GENERAL



Crear una aplicación con sidebar lateral colapsable y estas áreas:



Inicio

Portafolio

Incubadora

Departamentos

Agentes

Aprobaciones

Distribución

Finanzas

Exit Room

Configuración



El encabezado global debe mostrar:



Nombre de la sección.

Fecha y hora.

Estado general del sistema.

Alertas.

Buscador o comando rápido.

Perfil del usuario.

Botón de activación de ZADAR o NOVA según el rol.



PÁGINA 1: INICIO EJECUTIVO



Crear un dashboard con:



Indicadores superiores:



Ingresos totales.

Usuarios activos.

Aplicaciones activas.

Agentes ejecutándose.

Tareas pendientes.

Costos de IA del mes.

Incidentes críticos.

Aprobaciones pendientes.



Cada indicador debe mostrar:



Valor actual.

Variación.

Periodo comparado.

Estado.

Acceso a detalles.



Portafolio resumido:



Mostrar tres tarjetas iniciales: App 01, App 02 y App 03.



Cada tarjeta debe incluir:



Nombre.

Descripción breve.

Fase actual.

Progreso.

Estado técnico.

Estado comercial.

Responsable.

Próximo hito.

Fecha estimada de lanzamiento.

Riesgo actual.

Botón “Ver aplicación”.



Pipeline de incubación:



Idea → Inteligencia → Validación → Diseño → Desarrollo → QA → Lanzamiento → Crecimiento → Venta



Debe ser visual, claro y seleccionable. Al pulsar una etapa, mostrar los productos que se encuentran allí.



Actividad reciente:



Agente.

Departamento.

Acción realizada.

Producto afectado.

Resultado.

Hora.

Estado.

Enlace al reporte.



Aprobaciones:



Acción solicitada.

Agente solicitante.

Aplicación afectada.

Riesgo.

Costo.

Razón.

Botones “Aprobar”, “Rechazar” y “Solicitar cambios”.



En esta etapa los botones pueden funcionar sobre estado local o datos demo, pero no deben afirmar que ejecutaron acciones externas.



PÁGINA 2: PORTAFOLIO



Crear una vista escalable con tarjetas y tabla.



Filtros:



Fase.

Salud.

País.

Modelo de negocio.

Responsable.

Prioridad.

Estado.

Preparación para venta.



Cada producto debe tener una página detallada con pestañas:



Resumen.

Producto.

Mercado.

Tecnología.

Diseño.

Distribución.

Métricas.

Finanzas.

Riesgos.

Documentación.

Exit readiness.

Historial.



Agregar un “Health Score” del producto, claramente identificado como demostrativo hasta que exista una fórmula y datos reales.



PÁGINA 3: INCUBADORA



Crear un tablero para gestionar oportunidades y nuevos productos.



Etapas:



Idea capturada.

Investigación.

Problema validado.

Mercado validado.

Aprobada.

En construcción.

Lanzada.

Archivada.



Cada oportunidad debe contener:



Problema.

Cliente ideal.

Solución propuesta.

Competidores.

Diferenciación.

País o mercado.

Tamaño de oportunidad.

Complejidad.

Tiempo estimado.

Riesgo regulatorio.

Monetización.

Evidencia.

Puntuación.

Recomendación.



Añadir vistas Kanban y tabla.



PÁGINA 4: DEPARTAMENTOS



Crear tarjetas para:



Inteligencia competitiva.

Venture y validación.

Oportunidades internacionales.

Producto y diseño.

Ingeniería.

QA y seguridad.

Distribución y comunidad.

Marketing.

Ventas.

Finanzas y operaciones.

Preparación para adquisición.



Cada departamento debe mostrar:



Objetivo.

Agentes asignados.

Tareas actuales.

Tareas terminadas.

Bloqueos.

Presupuesto consumido.

Calidad de resultados.

Última actividad.



PÁGINA 5: AGENTES



Crear un registro central de agentes.



Cada agente debe tener:



Nombre.

Rol.

Departamento.

Descripción.

Capacidades.

Herramientas autorizadas.

Productos autorizados.

Estado: disponible, programado, ejecutando, esperando aprobación, bloqueado o error.

Tarea actual.

Última ejecución.

Próxima ejecución.

Costo acumulado.

Nivel de riesgo.

Historial.

Botón para abrir detalles.



Dentro del detalle del agente mostrar:



Objetivo.

Entradas recibidas.

Pasos realizados.

Salidas producidas.

Evidencias.

Costos.

Errores y reintentos.

Aprobaciones.

Registro de auditoría.



No uses lenguaje que haga parecer que los agentes están “vivos”. Son ejecutores de tareas disparados por eventos, horarios o acciones humanas.



PÁGINA 6: APROBACIONES



Crear una bandeja ejecutiva dividida en:



Urgentes.

Hoy.

Esta semana.

Informativas.

Resueltas.



Cada aprobación debe mostrar claramente:



Qué se propone.

Por qué.

Beneficio esperado.

Riesgo.

Costo.

Aplicación afectada.

Evidencias.

Recomendación del sistema.

Quién puede aprobar.

Fecha límite.



Las acciones sensibles nunca deben aprobarse automáticamente en la interfaz.



PÁGINA 7: DISTRIBUCIÓN



Esta será la cabina principal de la hermana del fundador y de NOVA.



Incluir:



Calendario editorial.

Comunidad.

Redes sociales.

Canal faceless de YouTube.

Campañas.

Embudo de crecimiento.

Piezas pendientes.

Contenido publicado.

Rendimiento por canal.

Experimentos.

Leads.

Conversión.

Próximas acciones.

Bandeja de aprobaciones de contenido.



Añadir vistas de calendario, Kanban y analítica.



PÁGINA 8: FINANZAS



Mostrar:



Ingresos por aplicación.

Costos por aplicación.

Costos de modelos de IA.

Hosting.

Software.

Margen estimado.

Burn mensual.

Runway.

Presupuesto por departamento.

Alertas de gasto.

Historial.



Incluir un módulo de consumo de ElevenLabs con alertas visuales en:



60%.

75%.

85%.

95%.



Nunca sugerir que los créditos se compraron automáticamente. La decisión de aumentar créditos corresponde al fundador.



PÁGINA 9: EXIT ROOM



Crear una vista de preparación para venta por aplicación:



Calidad del código.

Documentación.

Pruebas.

Seguridad.

Propiedad intelectual.

Dependencias.

Métricas.

Finanzas.

Contratos.

Datos.

Infraestructura.

Manuales operativos.

Riesgos.

Data room.

Readiness score.



No mostrar una valoración financiera inventada como si fuera real.



ZADAR Y NOVA



Crear dos asistentes visuales:



ZADAR:



Secretario ejecutivo del fundador.

Resume portafolio, tecnología, finanzas, estrategia, riesgos y aprobaciones.

Color principal azul eléctrico.



NOVA:



Secretaria ejecutiva de distribución.

Resume comunidad, campañas, contenido, marketing, crecimiento y conversiones.

Color principal violeta.



Añadir un control de voz elegante en la interfaz con la frase:



“Hora del show”



Estados visuales:



Inactivo.

Escuchando.

Procesando.

Respondiendo.

Error.

Límite de voz próximo.



En esta primera versión el módulo debe ser una demostración visual. No implementar escucha permanente ni afirmar que existe una conexión de voz real.



COMPONENTES REUTILIZABLES



Crear componentes limpios para:



Sidebar.

Header.

KPI cards.

Product cards.

Status badges.

Progress bars.

Agent cards.

Approval cards.

Activity timeline.

Charts.

Filters.

Tables.

Drawers.

Modals.

Empty states.

Loading states.

Error states.

Voice assistant widget.



EXPERIENCIA



Responsive para desktop, tablet y móvil.

Desktop es la experiencia prioritaria.

Navegación real entre secciones.

Sidebar colapsable.

Estados hover, focus y active.

Accesibilidad de teclado.

Contraste legible.

Tooltips donde sea necesario.

Confirmación antes de acciones sensibles.

Evitar tablas imposibles de leer en móvil.

Utilizar drawers o vistas resumidas en pantallas pequeñas.



ARQUITECTURA TÉCNICA



React y TypeScript.

Componentes modulares.

Tailwind CSS.

shadcn/ui cuando aporte valor.

Recharts para visualizaciones.

Iconos consistentes, preferiblemente Lucide.

No usar emojis como iconos principales.

Tipos TypeScript para productos, agentes, tareas, ejecuciones, aprobaciones, métricas, departamentos y costos.

Crear una capa de servicios separada de los componentes.

Mantener los datos demo en archivos claramente separados.

Preparar variables de entorno.

No colocar secretos en el frontend.

No crear dependencias innecesarias.

Mantener el proyecto exportable y sincronizable con GitHub.



PREPARACIÓN PARA BACKEND



Diseña la interfaz para conectarla posteriormente mediante API con el sistema construido por Claude Code.



Entidades previstas:



users

roles

products

product_stages

departments

agents

agent_runs

tasks

workflows

approvals

metrics

costs

incidents

reports

documents

audit_events

voice_briefings



Crea interfaces y servicios mock que luego puedan sustituirse por llamadas reales sin reescribir los componentes.



SEGURIDAD Y ROLES



Preparar visualmente dos roles:



CEO:



Acceso completo.

Aprobaciones financieras, técnicas y estratégicas.

ZADAR como asistente principal.



Directora de distribución:



Acceso a contenido, comunidad, campañas, distribución y métricas relacionadas.

NOVA como asistente principal.

Sin acceso automático a secretos técnicos o financieros sensibles.



No implementar todavía permisos ficticios como si fueran seguridad real. Dejar claramente preparada la estructura para conectarla posteriormente a autenticación y autorización del backend.



DATOS DE DEMOSTRACIÓN



Crear datos realistas para tres aplicaciones, varios agentes, tareas y aprobaciones.



Toda información simulada debe mostrar una etiqueta visible:



“DATOS DEMO”



No utilizar cifras exageradas como millones de ingresos en esta etapa. Emplear datos creíbles para una empresa que está comenzando.



PRIMERA ENTREGA



Construye primero:



Layout global.

Sidebar.

Inicio ejecutivo completo.

Tarjetas de las tres apps.

Pipeline de incubación.

Actividad reciente.

Bandeja de aprobaciones.

Widgets de ZADAR y NOVA.

Navegación funcional hacia páginas placeholder bien diseñadas para las demás secciones.

Diseño responsive.



No agregues todavía Supabase, pagos, autenticación real, ElevenLabs ni APIs externas. Primero quiero revisar y aprobar la interfaz.



Al finalizar:



Comprueba que no existan errores.

Comprueba desktop y móvil.

Mantén la estética de la imagen de referencia.

Muéstrame la primera entrega.

Pregúntame qué ajustes visuales deseo antes de construir las integraciones.ENTREGA COMPLETA EN UNA SOLA EJECUCIÓN



Construye ahora toda la interfaz del Command Center. No te detengas después del dashboard inicial, no crees páginas placeholder y no solicites aprobación entre etapas.



Debes completar:



Inicio ejecutivo.

Portafolio completo.

Página detallada para cada aplicación.

Pipeline de incubación.

Departamentos.

Registro y detalle de agentes.

Bandeja de aprobaciones.

Centro de distribución y comunidad.

Calendario de contenido.

Marketing y campañas.

Finanzas y control de costos.

Exit Room.

Configuración.

ZADAR.

NOVA.

Centro de briefings de voz.

Navegación completa.

Diseño responsive.

Estados vacíos, de carga y error.

Datos demo realistas y claramente identificados.



Todas las secciones deben ser navegables y visualmente terminadas. No utilices páginas vacías, texto “coming soon”, módulos incompletos ni botones principales sin respuesta visual.



Los botones pueden trabajar temporalmente con estado local y datos demo, pero nunca deben afirmar que ejecutaron una acción externa real.



Implementa interacciones visuales completas para:



Navegación.

Búsqueda.

Filtros.

Ordenamiento.

Cambio entre tabla, tarjetas y Kanban.

Apertura de detalles.

Modales.

Drawers.

Aprobar.

Rechazar.

Solicitar cambios.

Crear una tarea demo.

Cambiar el estado de una tarea demo.

Consultar una ejecución.

Consultar un reporte.

Visualizar costos.

Seleccionar una aplicación.

Seleccionar un departamento.

Activar visualmente ZADAR o NOVA.

Cambiar entre tema oscuro y claro si se implementa correctamente.



PORTABILIDAD OBLIGATORIA



Lovable es solamente una herramienta temporal para diseñar y generar este frontend. Será cancelado posteriormente.



Genera una aplicación completamente exportable y ejecutable fuera de Lovable utilizando:



React.

TypeScript.

Tailwind CSS.

Componentes estándar.

shadcn/ui cuando aporte valor.

Lucide Icons.

Recharts.

React Router o el sistema de rutas estándar del proyecto.



No utilizar:



Lovable Cloud.

Base de datos de Lovable.

Autenticación de Lovable.

Storage de Lovable.

Lovable AI.

Lovable Jobs.

Edge Functions de Lovable.

Secrets de Lovable.

Conectores exclusivos de Lovable.

APIs que requieran mantener activa una suscripción de Lovable.

Dependencias propietarias necesarias para ejecutar la aplicación.



No construyas el backend ni el motor de agentes. Claude Code ya está construyendo esos componentes por separado.



PREPARACIÓN PARA INTEGRACIÓN



Construye una capa de servicios desacoplada para que Claude pueda reemplazar los datos demo por la API real sin modificar los componentes visuales.



Organiza el proyecto con una estructura equivalente a:



components

pages

layouts

features

services

types

hooks

mock-data

config

utils



Crear tipos TypeScript para:



Product

Department

Agent

Task

Workflow

AgentRun

Approval

Report

Metric

Cost

Incident

AuditEvent

VoiceBriefing

User

Role



Crear servicios mock separados para:



products

agents

tasks

approvals

departments

metrics

costs

reports

voiceBriefings



Los componentes no deben importar directamente los archivos de datos demo. Deben consumirlos mediante la capa de servicios para poder sustituirla posteriormente por la API real.



SEGURIDAD



No colocar secretos, claves privadas ni credenciales administrativas en el frontend.



No implementar una seguridad ficticia basada únicamente en ocultar botones.



Mostrar visualmente los roles CEO y Directora de Distribución, pero dejar la autorización real preparada para el backend.



DISEÑO



Utiliza la imagen adjunta como referencia visual principal.



Mantén:



Estética premium de centro de mando.

Fondo carbón y azul marino.

Azul eléctrico para ZADAR y operaciones ejecutivas.

Violeta para NOVA y distribución.

Verde para estados saludables.

Ámbar para advertencias.

Rojo para errores y riesgos.

Paneles elegantes.

Excelente legibilidad.

Jerarquía visual clara.

Espaciado generoso.

Animaciones discretas.

Apariencia profesional.



Evita:



Interfaz excesivamente futurista.

Hologramas.

Saturación de elementos.

Tipografía diminuta.

Tarjetas innecesarias.

Gráficos decorativos sin utilidad.

Emojis usados como iconos.

Cifras empresariales exageradas.

Texto genérico.

Logos ficticios.



DATOS DEMO



Crea información realista para una incubadora que está comenzando:



Tres aplicaciones cercanas al lanzamiento.

Varios departamentos.

Agentes especializados.

Tareas en diferentes estados.

Aprobaciones.

Reportes.

Costos moderados.

Métricas iniciales.

Incidentes y alertas creíbles.

Contenido y campañas de distribución.



Mostrar siempre una etiqueta global claramente visible:



“DATOS DEMO”



No utilizar millones de dólares, cientos de empleados ni cifras incompatibles con una empresa nueva.



CONTROL DE CALIDAD FINAL



Antes de responder:



Recorre todas las rutas.

Corrige errores de compilación.

Corrige enlaces rotos.

Comprueba todas las interacciones principales.

Comprueba desktop, tablet y móvil.

Comprueba contraste y legibilidad.

Comprueba que no existan páginas placeholder.

Comprueba que no existan dependencias de producción de Lovable.

Comprueba que el proyecto pueda exportarse y ejecutarse localmente.

Comprueba que todos los datos demo estén separados de los componentes.

Mantén intacta la posibilidad de sincronizar el proyecto con GitHub.

Entrega toda la interfaz terminada en esta ejecución.



No te detengas para pedirme decisiones menores. Utiliza tu mejor criterio profesional y completa todo el frontend ahora. Solo detente si una acción requiere activar un servicio propietario, conectar una cuenta externa o introducir credenciales.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/59148f55-5500-471e-8293-71eba6bf42b9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

"use client";
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, Sparkles } from 'lucide-react';

// ============================================================================
// TIPOS Y CONSTANTES
// ============================================================================

type Grado = '1-2' | '3-4' | '5-6';

interface Respuesta {
    pregunta: string;
    valor: string;
}

interface FormularioData {
    grado: Grado;
    respuestas: Record<string, string>;
}

interface Pregunta {
    id: string;
    texto: string;
    opciones: {
        valor: string;
        texto: string;
        emoji?: string;
        descripcion?: string;
    }[];
}

// ============================================================================
// PREGUNTAS POR GRADO
// ============================================================================

const PREGUNTAS_1_2: Pregunta[] = [
    {
        id: 'P1',
        texto: '¿Cómo te gusta aprender mejor?',
        opciones: [
            { valor: 'A', texto: 'Viendo dibujos y colores', emoji: '🎨' },
            { valor: 'B', texto: 'Escuchando historias', emoji: '👂' },
            { valor: 'C', texto: 'Haciendo cosas con mis manos', emoji: '✋' }
        ]
    },
    {
        id: 'P2',
        texto: '¿Qué tan rápido entiendes las cosas nuevas?',
        opciones: [
            { valor: 'A', texto: 'Muy rápido, como un conejito', emoji: '🐇' },
            { valor: 'B', texto: 'Despacito, como una tortuga', emoji: '🐢' },
            { valor: 'C', texto: 'Normal, como un perrito', emoji: '🐕' }
        ]
    },
    {
        id: 'P3',
        texto: '¿Cuánto tiempo puedes estar atento sin distraerte?',
        opciones: [
            { valor: 'A', texto: 'Mucho tiempo (termino todo)', emoji: '⭐⭐⭐' },
            { valor: 'B', texto: 'Un ratito (necesito descansar)', emoji: '⭐⭐' },
            { valor: 'C', texto: 'Poquito (me distraigo fácil)', emoji: '⭐' }
        ]
    },
    {
        id: 'P4',
        texto: '¿Qué te gusta hacer más?',
        opciones: [
            { valor: 'A', texto: 'Dibujar y pintar', emoji: '🎨' },
            { valor: 'B', texto: 'Jugar y correr', emoji: '⚽' },
            { valor: 'C', texto: 'Escuchar cuentos', emoji: '📚' }
        ]
    },
    {
        id: 'P5',
        texto: '¿Cómo son las matemáticas para ti?',
        opciones: [
            { valor: 'A', texto: 'Fáciles (me gustan los números)', emoji: '😊' },
            { valor: 'B', texto: 'Normales (a veces fácil, a veces difícil)', emoji: '😐' },
            { valor: 'C', texto: 'Difíciles (me confundo)', emoji: '😕' }
        ]
    },
    {
        id: 'P6',
        texto: '¿Cómo lees?',
        opciones: [
            { valor: 'A', texto: 'Leo solito y entiendo todo', emoji: '📖' },
            { valor: 'B', texto: 'Leo, pero a veces no entiendo', emoji: '📕' },
            { valor: 'C', texto: 'Me cuesta leer, necesito ayuda', emoji: '📘' }
        ]
    },
    {
        id: 'P7',
        texto: '¿Qué pasa cuando te enseñan algo nuevo?',
        opciones: [
            { valor: 'A', texto: 'Hago muchas preguntas porque quiero aprender', emoji: '🤔' },
            { valor: 'B', texto: 'Escucho y hago lo que me dicen', emoji: '😊' },
            { valor: 'C', texto: 'Me aburro y quiero jugar', emoji: '😴' }
        ]
    },
    {
        id: 'P8',
        texto: '¿Qué haces cuando algo te sale mal?',
        opciones: [
            { valor: 'A', texto: 'Lo intento otra vez hasta que me salga', emoji: '💪' },
            { valor: 'B', texto: 'Me pongo triste y no quiero seguir', emoji: '😢' },
            { valor: 'C', texto: 'Pido ayuda y lo intento de nuevo', emoji: '😐' }
        ]
    },
    {
        id: 'P9',
        texto: '¿Cómo prefieres trabajar?',
        opciones: [
            { valor: 'A', texto: 'Solo, yo puedo hacerlo', emoji: '👤' },
            { valor: 'B', texto: 'Con mis amigos, es más divertido', emoji: '👥' },
            { valor: 'C', texto: 'Con la profesora ayudándome', emoji: '👨‍🏫' }
        ]
    },
    {
        id: 'P10',
        texto: '¿Cuándo tienes más energía?',
        opciones: [
            { valor: 'A', texto: 'En la mañana (cuando llego al colegio)', emoji: '🌅' },
            { valor: 'B', texto: 'En la tarde (después del recreo)', emoji: '🌆' },
            { valor: 'C', texto: 'Todo el día igual', emoji: '☀️' }
        ]
    }
];

const PREGUNTAS_3_4: Pregunta[] = [
    {
        id: 'P1',
        texto: '¿Cómo aprendes mejor en clase?',
        opciones: [
            { valor: 'A', texto: 'Con dibujos y videos', emoji: '👁️', descripcion: 'Cuando la profesora usa la pizarra' },
            { valor: 'B', texto: 'Escuchando explicaciones', emoji: '👂', descripcion: 'Cuando habla y puedo contar lo que aprendí' },
            { valor: 'C', texto: 'Haciendo experimentos', emoji: '✋', descripcion: 'Con actividades y materiales' },
            { valor: 'D', texto: 'De todas las formas', emoji: '🔄', descripcion: 'Me gusta variar' }
        ]
    },
    {
        id: 'P2',
        texto: 'Cuando la profesora explica algo nuevo...',
        opciones: [
            { valor: 'A', texto: 'Lo entiendo rápido', emoji: '🚀', descripcion: 'Y quiero hacer más ejercicios' },
            { valor: 'B', texto: 'Necesito que me lo explique varias veces', emoji: '🐢', descripcion: 'Con calma y paciencia' },
            { valor: 'C', texto: 'Lo entiendo después de 2 o 3 explicaciones', emoji: '⚖️', descripcion: 'Ni muy rápido ni muy lento' }
        ]
    },
    {
        id: 'P3',
        texto: '¿Cuánto tiempo puedes concentrarte en una tarea?',
        opciones: [
            { valor: 'A', texto: 'Más de 30 minutos sin parar', emoji: '⏰' },
            { valor: 'B', texto: 'Entre 15 y 20 minutos', emoji: '⏱️', descripcion: 'Después necesito un descanso' },
            { valor: 'C', texto: 'Menos de 10 minutos', emoji: '⏲️', descripcion: 'Me distraigo con otras cosas' }
        ]
    },
    {
        id: 'P4',
        texto: '¿Qué actividad te emociona más?',
        opciones: [
            { valor: 'A', texto: 'Arte y Cultura', emoji: '🎨', descripcion: 'Dibujar, música, teatro' },
            { valor: 'B', texto: 'Educación Física', emoji: '⚽', descripcion: 'Deportes, juegos, competencias' },
            { valor: 'C', texto: 'Ciencia y Tecnología', emoji: '🔬', descripcion: 'Experimentos, descubrir cómo funcionan las cosas' },
            { valor: 'D', texto: 'Comunicación', emoji: '📖', descripcion: 'Leer libros, escribir historias' },
            { valor: 'E', texto: 'Personal Social', emoji: '🤝', descripcion: 'Trabajar en equipo, ayudar a otros' }
        ]
    },
    {
        id: 'P5',
        texto: 'En matemáticas, ¿cómo te va?',
        opciones: [
            { valor: 'A', texto: 'Me va bien', emoji: '😃', descripcion: 'Resuelvo problemas sin mucha ayuda' },
            { valor: 'B', texto: 'Me va normal', emoji: '😊', descripcion: 'A veces necesito ayuda' },
            { valor: 'C', texto: 'Me cuesta mucho', emoji: '😟', descripcion: 'Necesito bastante apoyo' }
        ]
    },
    {
        id: 'P6',
        texto: 'Cuando lees un texto...',
        opciones: [
            { valor: 'A', texto: 'Leo rápido y entiendo todo', emoji: '📚' },
            { valor: 'B', texto: 'Leo bien, pero a veces tengo que releer', emoji: '📖' },
            { valor: 'C', texto: 'Leo despacio y no siempre entiendo', emoji: '📕' }
        ]
    },
    {
        id: 'P7',
        texto: '¿Cómo te sientes al aprender cosas nuevas?',
        opciones: [
            { valor: 'A', texto: 'Me emociona, siempre quiero saber más', emoji: '🌟' },
            { valor: 'B', texto: 'Me gusta si el tema es interesante', emoji: '😊' },
            { valor: 'C', texto: 'Prefiero hacer otras cosas', emoji: '😐', descripcion: 'Aprender es aburrido' }
        ]
    },
    {
        id: 'P8',
        texto: 'Cuando un ejercicio te sale mal...',
        opciones: [
            { valor: 'A', texto: 'No me rindo, busco otra forma', emoji: '💪' },
            { valor: 'B', texto: 'Me frustro y ya no quiero seguir', emoji: '😢' },
            { valor: 'C', texto: 'Me molesta, pero con ayuda puedo intentarlo', emoji: '🤔' }
        ]
    },
    {
        id: 'P9',
        texto: '¿Cómo prefieres hacer tus tareas?',
        opciones: [
            { valor: 'A', texto: 'Solo, me concentro mejor', emoji: '🧑' },
            { valor: 'B', texto: 'En grupo, aprendo más con mis compañeros', emoji: '👥' },
            { valor: 'C', texto: 'Con la profesora o mi mamá/papá guiándome', emoji: '👨‍🏫' }
        ]
    },
    {
        id: 'P10',
        texto: '¿En qué momento del día rindes mejor?',
        opciones: [
            { valor: 'A', texto: 'En las primeras horas de clase', emoji: '🌄', descripcion: 'Mañana' },
            { valor: 'B', texto: 'Después del recreo', emoji: '🌅', descripcion: 'Tarde' },
            { valor: 'C', texto: 'No hay diferencia', emoji: '☀️', descripcion: 'Rindo igual todo el día' }
        ]
    }
];

const PREGUNTAS_5_6: Pregunta[] = [
    {
        id: 'P1',
        texto: 'Identifica tu estilo de aprendizaje predominante',
        opciones: [
            { valor: 'A', texto: 'Visual', emoji: '👁️', descripcion: 'Aprendo mejor con esquemas, mapas conceptuales, videos y presentaciones' },
            { valor: 'B', texto: 'Auditivo', emoji: '👂', descripcion: 'Prefiero explicaciones orales, debates, podcasts' },
            { valor: 'C', texto: 'Kinestésico', emoji: '✋', descripcion: 'Necesito experimentar, manipular materiales y aprender haciendo' },
            { valor: 'D', texto: 'Multimodal', emoji: '🔄', descripcion: 'Combino varios estilos según la situación' }
        ]
    },
    {
        id: 'P2',
        texto: 'Evalúa tu velocidad de procesamiento de información',
        opciones: [
            { valor: 'A', texto: 'Rápida', emoji: '⚡', descripcion: 'Capto conceptos rápidamente, me aburro con repeticiones' },
            { valor: 'B', texto: 'Pausada', emoji: '🐢', descripcion: 'Necesito tiempo y varias explicaciones para comprender bien' },
            { valor: 'C', texto: 'Moderada', emoji: '⚖️', descripcion: 'Entiendo con 2-3 explicaciones y ejemplos' }
        ]
    },
    {
        id: 'P3',
        texto: '¿Cuál es tu capacidad de concentración sostenida?',
        opciones: [
            { valor: 'A', texto: 'Alta', emoji: '⭐⭐⭐', descripcion: 'Puedo concentrarme 30-45 minutos sin interrupciones' },
            { valor: 'B', texto: 'Media', emoji: '⭐⭐', descripcion: 'Mantengo atención por 15-25 minutos, luego necesito pausas' },
            { valor: 'C', texto: 'Baja', emoji: '⭐', descripcion: 'Me cuesta concentrarme más de 10 minutos' }
        ]
    },
    {
        id: 'P4',
        texto: '¿Qué área del conocimiento te apasiona más?',
        opciones: [
            { valor: 'A', texto: 'Arte y Cultura', emoji: '🎨', descripcion: 'Artes visuales, música, danza, teatro' },
            { valor: 'B', texto: 'Educación Física', emoji: '⚽', descripcion: 'Deportes, actividades físicas, competencias' },
            { valor: 'C', texto: 'Ciencia y Tecnología', emoji: '🔬', descripcion: 'Experimentos, tecnología, robótica, programación' },
            { valor: 'D', texto: 'Comunicación', emoji: '📖', descripcion: 'Lectura, escritura creativa, redacción, idiomas' },
            { valor: 'E', texto: 'Personal Social', emoji: '🤝', descripcion: 'Historia, geografía, ciudadanía, trabajo colaborativo' },
            { valor: 'F', texto: 'Matemática', emoji: '🔢', descripcion: 'Números, lógica, resolución de problemas abstractos' }
        ]
    },
    {
        id: 'P5',
        texto: 'Autoevalúa tu nivel en matemáticas',
        opciones: [
            { valor: 'A', texto: 'Avanzado', emoji: '🏆', descripcion: 'Resuelvo problemas complejos, me gustan los desafíos matemáticos' },
            { valor: 'B', texto: 'Intermedio', emoji: '📊', descripcion: 'Domino operaciones básicas, pero los problemas difíciles me cuestan' },
            { valor: 'C', texto: 'Básico', emoji: '📉', descripcion: 'Tengo dificultades con operaciones y necesito apoyo constante' }
        ]
    },
    {
        id: 'P6',
        texto: 'Autoevalúa tu comprensión lectora',
        opciones: [
            { valor: 'A', texto: 'Experto', emoji: '📚', descripcion: 'Leo fluidamente, comprendo textos complejos y puedo hacer análisis crítico' },
            { valor: 'B', texto: 'Desarrollado', emoji: '📖', descripcion: 'Leo bien, entiendo ideas principales pero a veces pierdo detalles' },
            { valor: 'C', texto: 'Inicial', emoji: '📕', descripcion: 'Leo con dificultad, me cuesta entender lo que leo' }
        ]
    },
    {
        id: 'P7',
        texto: '¿Cómo describes tu motivación para aprender?',
        opciones: [
            { valor: 'A', texto: 'Alta', emoji: '🔥', descripcion: 'Soy curioso, investigo por mi cuenta, disfruto aprender cosas nuevas' },
            { valor: 'B', texto: 'Media', emoji: '😊', descripcion: 'Aprendo lo que me enseñan, pero no busco información adicional' },
            { valor: 'C', texto: 'Baja', emoji: '😐', descripcion: 'Estudiar me aburre, prefiero hacer otras actividades' }
        ]
    },
    {
        id: 'P8',
        texto: '¿Cómo manejas la frustración ante errores?',
        opciones: [
            { valor: 'A', texto: 'Resiliente', emoji: '💪', descripcion: 'Los errores son oportunidades de aprendizaje, persisto hasta lograrlo' },
            { valor: 'B', texto: 'Intermedio', emoji: '🤔', descripcion: 'Me frustro, pero con apoyo puedo continuar' },
            { valor: 'C', texto: 'Sensible', emoji: '😢', descripcion: 'Me desanimo fácilmente y evito tareas difíciles' }
        ]
    },
    {
        id: 'P9',
        texto: '¿Cuál es tu modalidad de trabajo preferida?',
        opciones: [
            { valor: 'A', texto: 'Independiente', emoji: '🧑', descripcion: 'Prefiero trabajar solo, soy autodidacta y organizado' },
            { valor: 'B', texto: 'Colaborativo', emoji: '👥', descripcion: 'Aprendo mejor en equipo, compartiendo ideas con compañeros' },
            { valor: 'C', texto: 'Guiado', emoji: '👨‍🏫', descripcion: 'Necesito instrucciones claras y supervisión del profesor' }
        ]
    },
    {
        id: 'P10',
        texto: '¿Cuándo experimentas tu pico de energía y concentración?',
        opciones: [
            { valor: 'A', texto: 'Matutino', emoji: '🌅', descripcion: 'Soy más productivo en las primeras horas del día' },
            { valor: 'B', texto: 'Vespertino', emoji: '🌆', descripcion: 'Rindo mejor después del mediodía' },
            { valor: 'C', texto: 'Flexible', emoji: '☀️', descripcion: 'Mi rendimiento es constante durante todo el día' }
        ]
    }
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function FormularioCategorización() {
    const [paso, setPaso] = useState(0); // 0 = selector de grado, 1-10 = preguntas, 11 = resultado
    const [grado, setGrado] = useState<Grado | null>(null);
    const [respuestas, setRespuestas] = useState<Record<string, string>>({});
    const [mostrarResultado, setMostrarResultado] = useState(false);

    const preguntas = grado === '1-2' ? PREGUNTAS_1_2 : grado === '3-4' ? PREGUNTAS_3_4 : PREGUNTAS_5_6;
    const preguntaActual = preguntas[paso - 1];
    const totalPreguntas = preguntas.length;
    const progreso = ((paso - 1) / totalPreguntas) * 100;

    const seleccionarGrado = (gradoSeleccionado: Grado) => {
        setGrado(gradoSeleccionado);
        setPaso(1);
    };

    const seleccionarRespuesta = (valor: string) => {
        const nuevasRespuestas = {
            ...respuestas,
            [preguntaActual.id]: valor
        };
        setRespuestas(nuevasRespuestas);

        // Auto-avanzar después de seleccionar
        setTimeout(() => {
            if (paso < totalPreguntas) {
                setPaso(paso + 1);
            } else {
                setMostrarResultado(true);
            }
        }, 300);
    };

    const retroceder = () => {
        if (paso > 1) {
            setPaso(paso - 1);
        } else {
            setGrado(null);
            setPaso(0);
            setRespuestas({});
        }
    };

    const reiniciar = () => {
        setGrado(null);
        setPaso(0);
        setRespuestas({});
        setMostrarResultado(false);
    };

    // ============================================================================
    // PANTALLA DE SELECCIÓN DE GRADO
    // ============================================================================

    if (paso === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
                <div className="max-w-4xl w-full">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
                            <Sparkles className="w-10 h-10 text-purple-600" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                            ¡Descubre cómo aprendes mejor! 🚀
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Responde 10 preguntas sencillas para crear tu perfil de aprendizaje personalizado
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Grado 1-2 */}
                        <button
                            onClick={() => seleccionarGrado('1-2')}
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-4 border-transparent hover:border-yellow-400"
                        >
                            <div className="text-6xl mb-4">🌟</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">1ro - 2do</h3>
                            <p className="text-gray-600 text-sm mb-4">6 - 7 años</p>
                            <div className="bg-yellow-100 rounded-lg p-3">
                                <p className="text-xs text-yellow-800 font-medium">
                                    Preguntas con emojis grandes y opciones simples
                                </p>
                            </div>
                        </button>

                        {/* Grado 3-4 */}
                        <button
                            onClick={() => seleccionarGrado('3-4')}
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-4 border-transparent hover:border-blue-400"
                        >
                            <div className="text-6xl mb-4">⭐</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">3ro - 4to</h3>
                            <p className="text-gray-600 text-sm mb-4">8 - 9 años</p>
                            <div className="bg-blue-100 rounded-lg p-3">
                                <p className="text-xs text-blue-800 font-medium">
                                    Preguntas con descripciones y más opciones
                                </p>
                            </div>
                        </button>

                        {/* Grado 5-6 */}
                        <button
                            onClick={() => seleccionarGrado('5-6')}
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-4 border-transparent hover:border-purple-400"
                        >
                            <div className="text-6xl mb-4">🌈</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">5to - 6to</h3>
                            <p className="text-gray-600 text-sm mb-4">10 - 11 años</p>
                            <div className="bg-purple-100 rounded-lg p-3">
                                <p className="text-xs text-purple-800 font-medium">
                                    Preguntas de autoevaluación más detalladas
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================================
    // PANTALLA DE RESULTADO
    // ============================================================================

    if (mostrarResultado) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
                            <CheckCircle className="w-14 h-14 text-green-600" />
                        </div>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            ¡Felicitaciones! 🎉
                        </h2>
                        <p className="text-lg text-gray-600">
                            Has completado el formulario de categorización
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                        <h3 className="font-bold text-gray-800 mb-4 text-lg">Tus respuestas:</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {Object.entries(respuestas).map(([pregunta, respuesta]) => (
                                <div key={pregunta} className="bg-white rounded-lg p-3 text-center">
                                    <div className="text-xs text-gray-500 mb-1">{pregunta}</div>
                                    <div className="text-xl font-bold text-purple-600">{respuesta}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-6 mb-6">
                        <p className="text-sm text-purple-800">
                            <strong>📊 Siguiente paso:</strong> Tu perfil se procesará para generar contenido personalizado adaptado a tu estilo de aprendizaje.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={reiniciar}
                            className="flex-1 py-4 px-6 bg-gray-200 text-gray-800 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                        >
                            Volver a empezar
                        </button>
                        <button
                            onClick={() => {
                                console.log('Perfil completo:', { grado, respuestas });
                                alert('En producción, aquí se enviaría al backend para procesamiento');
                            }}
                            className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-colors"
                        >
                            Continuar →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================================
    // PANTALLA DE PREGUNTAS
    // ============================================================================

    const estiloGrado = grado === '1-2' ? 'from-yellow-50 via-orange-50 to-red-50' :
        grado === '3-4' ? 'from-blue-50 via-indigo-50 to-purple-50' :
            'from-purple-50 via-pink-50 to-rose-50';

    return (
        <div className={`min-h-screen bg-gradient-to-br ${estiloGrado} flex items-center justify-center p-4`}>
            <div className="max-w-3xl w-full">
                {/* Barra de progreso */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">
                            Pregunta {paso} de {totalPreguntas}
                        </span>
                        <span className="text-sm font-medium text-purple-600">
                            {Math.round(progreso)}% completo
                        </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
                            style={{ width: `${progreso}%` }}
                        />
                    </div>
                </div>

                {/* Card de la pregunta */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
                    {/* Texto de la pregunta */}
                    <div className="mb-8">
                        <h2 className={`font-bold text-gray-800 mb-2 ${grado === '1-2' ? 'text-2xl md:text-3xl' :
                            grado === '3-4' ? 'text-xl md:text-2xl' :
                                'text-lg md:text-xl'
                            }`}>
                            {preguntaActual.texto}
                        </h2>
                        {grado === '1-2' && (
                            <p className="text-sm text-gray-500">
                                Elige la opción que más te guste 😊
                            </p>
                        )}
                    </div>

                    {/* Opciones */}
                    <div className={`grid gap-4 ${grado === '1-2' ? 'grid-cols-1' :
                        preguntaActual.opciones.length > 4 ? 'grid-cols-1 md:grid-cols-2' :
                            'grid-cols-1'
                        }`}>
                        {preguntaActual.opciones.map((opcion) => {
                            const estaSeleccionada = respuestas[preguntaActual.id] === opcion.valor;

                            return (
                                <button
                                    key={opcion.valor}
                                    onClick={() => seleccionarRespuesta(opcion.valor)}
                                    className={`
                    relative p-6 rounded-2xl border-3 transition-all duration-300
                    ${estaSeleccionada
                                            ? 'border-purple-500 bg-purple-50 scale-105 shadow-lg'
                                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25 hover:scale-102'
                                        }
                    ${grado === '1-2' ? 'min-h-[100px]' : 'min-h-[80px]'}
                  `}
                                >
                                    {estaSeleccionada && (
                                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-5 h-5 text-white" />
                                        </div>
                                    )}

                                    <div className="flex items-start gap-4">
                                        {/* Emoji */}
                                        {opcion.emoji && (
                                            <div className={`${grado === '1-2' ? 'text-5xl' :
                                                grado === '3-4' ? 'text-4xl' :
                                                    'text-3xl'
                                                }`}>
                                                {opcion.emoji}
                                            </div>
                                        )}

                                        {/* Contenido */}
                                        <div className="flex-1 text-left">
                                            {/* Valor de la opción (A, B, C...) */}
                                            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${estaSeleccionada
                                                ? 'bg-purple-500 text-white'
                                                : 'bg-gray-200 text-gray-600'
                                                }`}>
                                                {opcion.valor}
                                            </div>

                                            {/* Texto principal */}
                                            <div className={`font-semibold text-gray-800 ${grado === '1-2' ? 'text-xl' :
                                                grado === '3-4' ? 'text-lg' :
                                                    'text-base'
                                                }`}>
                                                {opcion.texto}
                                            </div>

                                            {/* Descripción (solo para 3-4 y 5-6) */}
                                            {opcion.descripcion && grado !== '1-2' && (
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {opcion.descripcion}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Botones de navegación */}
                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={retroceder}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            {paso === 1 ? 'Cambiar grado' : 'Anterior'}
                        </button>

                        {respuestas[preguntaActual.id] && (
                            <button
                                onClick={() => {
                                    if (paso < totalPreguntas) {
                                        setPaso(paso + 1);
                                    } else {
                                        setMostrarResultado(true);
                                    }
                                }}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors shadow-lg"
                            >
                                {paso < totalPreguntas ? 'Siguiente' : 'Finalizar'}
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Indicador de ayuda para grado 1-2 */}
                {grado === '1-2' && (
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 bg-white/50 backdrop-blur-sm rounded-full px-6 py-3 inline-block">
                            💡 Pídele a un adulto que te ayude a leer si lo necesitas
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
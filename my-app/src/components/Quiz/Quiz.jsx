import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { LangContext } from '../../App';

export const Quiz = ({quiz}) => {  
  // Hacemos uso nuevamente del contexto para las tracucciones relativas a los quizzes y botones
  const {dictionary} = useContext(LangContext)

  // En este estado almacenaremos los quizzes en un array
  const [quizzes, setQuizzes] = useState( quiz ? [...quiz] : [])

  // En este estado almacenaremos las respuestas de los usuarios en un array del mismo tamaño que el de los quizzes,
  // pero donde todos los valores son inicializados a string vacio porque no hay ninguna pregunta respondida
  const [quizzesAnswers, setQuizzesAnswers] = useState(Array.from("".repeat(quizzes.length)))

  // En este estado almacenaremos el indice del quizz actual en el que nos encontremos
  const [currentQuiz, setCurrentQuiz] = useState(0)

  // En este estado almacenaremos un booleano para indicar cuando ha acabado la partida
  const [finished, setFinished] = useState(false)

  // En este estado almacenaremos la puntuación del jugador
  const [score, setScore] = useState(0)

  // Si estamos en la primera pregunta, deshabilitamos el boton para ir a la anterior pregunta
  const prevBtn = document.querySelector('.prev')
  if (currentQuiz === 0 && prevBtn) prevBtn.disabled = true
  if (currentQuiz !== 0 && prevBtn) prevBtn.disabled = false

  // Si estamos en la ultima pregunta, deshabilitamos el boton para ir a la siguiente pregunta
  const nextBtn = document.querySelector('.next')
  if (currentQuiz === 9 && nextBtn) nextBtn.disabled = true
  if (currentQuiz !== 9 && nextBtn) nextBtn.disabled = false
  
  // Nos creamos una funcion para hacer una peticion nuevamente al servidor para obtener mas quizzes, en esta no usamos react query porque
  // dió problemas
  const refetchData = async () => fetch('https://core.dit.upm.es/api/quizzes/random10wa?token=db08188a25ce1fc499ba').then((res) => res.json())

  // Nos creamos el handler para el boton de siguiente, que lo que hace es guardar el contenido del input
  // en el array de respuestas, pone el valor del input a string vacio y aumenta la quizz en la que nos encontramos
  // una unidad para que se renderize la siguiente. En caso de que estemos en la ultima pregunta, se llama al handler
  // del boton de submit
  const handleNextClick = () => {
    if (currentQuiz === 9) {
      handleSubmit()
    } else {
      const input = document.querySelector("input")
      quizzesAnswers[currentQuiz] = input.value.toLowerCase()
      input.value = ""
      setCurrentQuiz(currentQuiz + 1)  
    }
  }

  // Nos creamos el handler para el boton de anterior, que lo que hace es guardar el contenido del input
  // en el array de respuestas y disminuye la quizz en la que nos encontramos
  // una unidad para que se renderize la anterior, cargando su respuesta si es que tuviera una guardada
  const handlePreviousClick = () => {
    if (currentQuiz !== 0) {
      const input = document.querySelector("input")
      quizzesAnswers[currentQuiz] = input.value.toLowerCase()
      setCurrentQuiz(currentQuiz - 1)
      input.value = quizzesAnswers[currentQuiz - 1]
    }
  }

  // Nos creamos el handler para el boton de submit, que lo que hace es guardar también el contenido actual del input
  // por si el jugador le da a submit antes de los esperado, luego guardamos las respuestas de cada quizz y las comparamos
  // con las del jugardor, haciendo uso de localeCompare, funcion que devuelve 0 si los strings son iguales y vamos guardando
  // los resultados de las comparaciones en un array. Por ultimo recorremos ese array y nos quedamos solo con los 0, lo que 
  // significa que el tamaño de nuestro array generado es el numero de respuestas acertadas, así que seteamos la puntuacion
  // del jugador y damos el juego por terminado para que se renderizen las puntuaciones en pantalla
  const handleSubmit = () => {
    const input = document.querySelector("input")
    quizzesAnswers[currentQuiz] = input.value.toLowerCase()
    
    const answers = quizzes.map((quiz) => quiz.answer.toLowerCase())
    const evaluatedAnswers = answers.map((answer, index) => (answer.localeCompare(quizzesAnswers[index])))
    const correctAnswers = evaluatedAnswers.filter((answer) => answer === 0)
    setScore(correctAnswers.length)
    setFinished(!finished)
  }

  // Nos creamos el handler para el boton de reset, que lo que hace es pedir nuevos quizzes al servidor y guardarlos en nuestro estado de quizzes,
  // y luego se resetean todo el resto de estados a los valores iniciales
  const handleReset = async() => {
    const data = await refetchData()
    setQuizzes([...data])
    setQuizzesAnswers(Array.from("".repeat(quizzes.length)))
    setCurrentQuiz(0)
    setFinished(false)
    setScore(0)  
  }

  // Nos creamos el handler para el boton correspondiente a los indices de las preguntas para movernos a ellas directamente,
  // el cual lo que hace es guardar la respuesta que tengamos actualmente en el input, y luego avanzamos a la pregunta seleccionada
  // cargando su respuesta si es que fue respondida o mostrando string vacio en caso de que no tenga
  const handleQuestionClick = (index) => {
    const input = document.querySelector("input")
    quizzesAnswers[currentQuiz] = input.value.toLowerCase()
    setCurrentQuiz(index)  
    input.value = quizzesAnswers[index] !== undefined  ? quizzesAnswers[index] : ""
  }

  // Hacemos uso de un hook use effect para controlar el evento lanzado al pulsar la tecla enter, al cual reaccionaremos
  // llamando a la funcion del boton de next, para que se avanze a la siguiente pregunta
  useEffect(() => {
    const listener = event => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        handleNextClick();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [handleNextClick]);

  // Nos creamos un array auxiliar con los indices de las preguntas, para mapearlos luego creando los bottones de acceso directo a las preguntas
  const questions = quizzes.map((_, i) => i)
  
  // Si no se han encontrado quizzes mostramos una pantalla de error con los botones deshabilitados excepto el de reset,
  // el cual si lo pulsamos se pediran quizzes al servidor y se podrá jugar 
  if (quizzes.length === 0) 
  return <div className="quiz-container">
    <h1>{dictionary.quiz.notFound}</h1>
    <div className="quiz-buttons">
      <Button onClick={handleReset}>
      {dictionary.quiz.buttons.reset}
      </Button>
      <Button disabled onClick={handleSubmit}>
      {dictionary.quiz.buttons.submit}
      </Button>
      <Button disabled onClick={handlePreviousClick}>
      {dictionary.quiz.buttons.previous}
      </Button>
      <Button disabled onClick={handleNextClick} className='next'>
      {dictionary.quiz.buttons.next}
      </Button>
    </div>
  </div>
  // Mientras no se haya acabado el juego se siguen renderizando los datos del mismo
  else if (!finished)
  return <div className='quiz-container'>
      <div className="quiz-header">
        <Button>✔</Button>
        <h1>QUIZ</h1>
        <h2>{dictionary.quiz.title}</h2>
      </div>
      <div className="quiz-content">
        {/* Aqui montamos con un map como se indicó en el enunciado, los botones correspondientes a cada pregunta para poder accederlas de manera directa */}
        <div className="question-selector">
          {questions.map((index) => <button key={index} className='question' onClick={() => handleQuestionClick(index)}>{index + 1}</button>)}
        </div>
        <div className="main-content">
          <div className="left-content">
            {/* En caso de que la pregunta traiga foto la mostramos, si no cargamos una imagen por defecto */}
            <img src={quizzes[currentQuiz].attachment ? quizzes[currentQuiz].attachment.url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReApERYtN8ejVuKMsg6lSAwhvWrA3b06-tpw&usqp=CAU"} alt='' />
          </div>
          <div className="right-content">
            <h1>{dictionary.quiz.question} {currentQuiz + 1}</h1>
            {/* En vista de que hay preguntas con texto muy largo debido a que los compañeros asi las han realizado, hemos limitado la cantidad de caracteres a mostrar a 200 */}
            <h2>{quizzes[currentQuiz]?.question.length > 200 ? quizzes[currentQuiz]?.question.slice(0,200).concat("...") : quizzes[currentQuiz]?.question }</h2>
            <input className='answer' type="text" placeholder={dictionary.quiz.input} />
          </div>
        </div>
        <div className="content-footer">
        {/* Si el autor de la pregunta existe y es admin se muestra su username, si no se muestra su profileName */}
        <span>
         {dictionary.quiz.createdBy} {quizzes[currentQuiz].author && quizzes[currentQuiz].author.isAdmin ?  quizzes[currentQuiz]?.author.username : quizzes[currentQuiz]?.author.profileName}
         </span>
         <img src={quizzes[currentQuiz]?.author.photo ? quizzes[currentQuiz]?.author.photo.url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKsmTSO8AUBRn1D-9hiSMles-PJRO9Ci5_5w&usqp=CAU"} alt="" />
      </div>
      </div>
      <div className="quiz-buttons">
        <Button onClick={handleReset}>
        {dictionary.quiz.buttons.reset}
        </Button>
        <Button onClick={handleSubmit}>
        {dictionary.quiz.buttons.submit}  
        </Button>
        <Button onClick={handlePreviousClick} className='prev'>
        {dictionary.quiz.buttons.previous}
        </Button>
        <Button onClick={handleNextClick} className='next'>
        {dictionary.quiz.buttons.next}
        </Button>
      </div>
    </div>

    // En caso de que el juego finalize, se muestra la puntuación del jugador 
    return <div className="quiz-container">
      <h1>{dictionary.quiz.yourPoints}: {score}/10 {dictionary.quiz.points}</h1>
      <div className="quiz-buttons">
        <Button onClick={handleReset}>
        {dictionary.quiz.buttons.reset}
        </Button>
      </div>
    </div>
}

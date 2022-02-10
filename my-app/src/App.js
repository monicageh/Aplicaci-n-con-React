import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Header } from './components/Header';
import { Home } from './components/Home/Home';
import { NavBar } from './components/Navbar';
import { Quiz } from './components/Quiz/Quiz';
import { Tictactoe } from './components/Tictactoe/Tictactoe';
import * as en from './lang/en.json';
import * as es from './lang/es.json';

// Definimos el diccionario con los .json que nos hemos importado para los lenguajes a contemplar (español, inglés) 
const dictionaryList = { en, es }

// Creamos el contexto a usar para el manejo de idiomas en la web, dandole valores por defecto a las claves del objeto
export const LangContext = React.createContext({ userLang: 'es', dictionary: es });

// Creamos un hook personalizado para obtener los quizzes del servidor haciendo uso de la librería react query
export function FetchQuizzes() {
  const {isLoading, data } = useQuery('quizzesData', () => fetch('https://core.dit.upm.es/api/quizzes/random10wa?token=db08188a25ce1fc499ba').then((res) => res.json()))
  return {isLoading, data}
}

function App() {
  // Creamos un estado que usaremos para controlar el idioma seleccionado en la aplicación en cada momento
  const [lang, setLang] = useState('es')

  // Creamos un handler para manejar el evento que se lanza al cambiar de idioma en el selector
  const handleLanguageChange = (event) => {
    setLang(event.target.value);
  }

  // Obtenemos los quizzes del servidor y los guardamos en data
  const { data } = FetchQuizzes()  

  return (
      // Envolvemos la aplicacion con el contexto creado para las traducciones de nuestra aplicacion, pasandole el handler creado para el cambio de idioma,
      // ademas de el estado del idioma actual, y el json correspondiente accediendolo desde dictionaryList e indexando con lang
      <LangContext.Provider value={{ handleLanguageChange: handleLanguageChange, userLang: lang, dictionary: dictionaryList[lang] }}>
        <div className='main-app'>
          <Header setLanguage={setLang}/>
          <NavBar/>
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='tictactoe' element={<Tictactoe />}></Route>
            {/* En esta última ruta, indicamos ademas que para el componente Quiz, le pasamos una prop "quiz" con el contenido de los quizzes obtenidos del server */}
            <Route path='quiz' element={<Quiz quiz={data} />}></Route>
          </Routes>
        </div>
      </LangContext.Provider>
  )
}

export default App;

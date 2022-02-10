import React, { useContext } from 'react';
import { LangContext } from '../../App';

export const Home = () => {
  // Hacemos uso del contexto para cargar correctamente los textos de bienvenida
  const { dictionary } = useContext(LangContext)

  return (
    <div className='home-container'>
      <div className="home-header">
        {/* Para cargar los textos de bienvenida recorremos del diccionario, todas las frases contenidas en el array welcome que está dentro del apartado home */}
        {dictionary.home.welcome.map((text, index) => <h3 key={index}>{text}</h3>)}
      </div>
      {/* Además, hemos incluido que la imagen tambien cambie conforme cambia el idioma */}
      <img className='home-img' src={dictionary.home.img} alt="" />
    </div>
  )
  }

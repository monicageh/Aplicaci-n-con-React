import React, { useContext } from 'react';
import { LangContext } from '../App';
import { LangSelector } from './LangSelector';

export const Header = () => {
  // Hacemos uso del contexto langCohtext para obtener las traducciones concretas a utilizar
  const { dictionary } = useContext(LangContext)

  return (
    <div className='header'>
      {/* En este caso usamos el contexto para manejar el titulo de la pagina */}
      <h3>{ dictionary.pageTitle }</h3>
      <LangSelector></LangSelector>
    </div>
  )
}

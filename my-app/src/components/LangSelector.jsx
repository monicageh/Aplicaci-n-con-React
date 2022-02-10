import { Form } from "react-bootstrap";
import { LangContext } from "../App";

export const LangSelector = () => {
  // Aqui definimos el consumer de nuestro contexto, el cual se encarga de mutar los valores del lenguaje seleccionado con el 
  // handlers pasado al onChange, y en el value mostramos el lenguaje actual
  return <LangContext.Consumer>
    {(context) => {
      return <Form.Select size="sm" onChange={context.handleLanguageChange} value={context.userLang}>
          {/* Para las opciones indexamos el diccionario con las claves */}
          <option key="es" value="es">{context.dictionary["es"]}</option>
          <option key="en" value="en">{context.dictionary["en"]}</option>
        </Form.Select>
      }
    }		
    </LangContext.Consumer>
}

/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';
import '../css/app.css';
import Navbar from '../components/Navbar';
import HomePage from '../pages/HomePage';
import ProfilesPage from '../pages/ProfilesPages';
import ProfilePage from '../pages/ProfilePage';

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

console.log('Salut ami ZicoS ! Alors, on joue de la console ;-) ?');

const App = () => {
    return (
        <HashRouter>
            <Navbar />
            <Switch>
                <Route path="/profils/:id" component={ProfilePage} />
                <Route path="/profils" component={ProfilesPage} />
                <Route path="/" component={HomePage}/>
            </Switch>
        </HashRouter>
    )
}

// On récupère la div avec l'id "app" qu'on a créé dans le block body de index.html.twig :
const rootElement = document.querySelector('#app');
// On demande à ReactDOM de faire le rendu de notre constante App dans la div #app :
ReactDOM.render(<App/>, rootElement);


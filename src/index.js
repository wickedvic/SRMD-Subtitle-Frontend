import React from 'react';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = document.getElementById("root");
root.render(
    <React.StrictMode>
        {/* <App /> */}
        <App />
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// import 'core-js';
// import 'normalize.css';
// import './libs/contextmenu.css';
// import React from 'react';
// import ReactDOM from 'react-dom';
// import { isMobile } from './utils';
// import { setLocale, setTranslations } from 'react-i18nify';
// import i18n from './i18n';
// import App from './App';
// import VideoPlayerApp from './VideoPlayerApp';
// import Mobile from './Mobile';
// import GlobalStyle from './GlobalStyle';

// setTranslations(i18n);
// const language = navigator.language.toLowerCase();
// const defaultLang = i18n[language] ? language : 'en';
// setLocale(defaultLang);

// ReactDOM.render(
// <React.Fragment>

//     <GlobalStyle />
//     {isMobile ? <Mobile /> : <VideoPlayerApp defaultLang={defaultLang} />}
// </React.Fragment>,
//     document.getElementById('root'),
// );

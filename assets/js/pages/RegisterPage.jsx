//----------------------------------------------IMPORTS :
import React, { useState,useContext,useEffect } from "react";

import {toast} from "react-toastify"

import Collapse from 'react-bootstrap/Collapse'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Modal from 'react-bootstrap/Modal'

import LogedInModalContext from "../contexts/LogedInModalContext";

import userAPI from "../services/userAPI";

import Field from "../components/forms/Field";
import LoginModal from "../components/LoginModal";

//----------------------------------------------FUNCTIONNAL COMPONENT : 
const RegisterPage = ({history}) => {
  //----------------------------------------------CONTEXTS :
  const{logedInModal, setLogedInModal} = useContext(LogedInModalContext)
  
  //----------------------------------------------STATES:
  // on gère l'état du user créé avec un objet
  const [user, setUser] = useState({
    email: "",
    birthDate: "",
    password: "",
    passwordConfirm: ""
  });
  //pour gérer les erreurs :
  const [errors, setErrors] = useState({
    email: "",
    birthDate: "",
    password: "",
    passwordConfirm: ""
  });
  // pour gérer le formulaire en collapse
  const [open, setOpen] = useState(false);
  // pour gérer la modal des CGU :
  const [show, setShow] = useState(false);

  //pour gérer la validation
  const [validated, setValidated] = useState(false);
  const [termsValidation, setTermsValidation] = useState()
  
  //----------------------------------------------FUNCTIONS :
  //gestion modal CGU :
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //fct pour gérer les changements dans le formulaire :
  const handleChange = ({ currentTarget }) => {
    // extrait le name et la value depuis le champs en cours (currentTarget)
    // console.log(currentTarget);
    const { name, value } = currentTarget;
    //modifie le profil dans l'état en prenant tout ce qu'il y a déjà dans le profil mais écrase la propriété qu'il y a dans name par la donnée "value"
    setUser({ ...user, [name]: value });
  };

  const handleTermsValidation = () => {
    setTermsValidation(false)
    console.log("CGU acceptées")
  }
  
  //fct pour gérer la soumission du formulaire
  const handleSubmit = async event => {
    event.preventDefault();
    const apiErrors = {};
    //Erreur "personnalisée" pour la validation du mdp
    if(user.password !== user.passwordConfirm){
      apiErrors.passwordConfirm = "Votre confirmation ne correspond pas à votre premier mot de passe";
      setErrors(apiErrors)
      return;
    }
    //Erreur si la date de naissance est vide (car ce cas de figure est non gérer par l'api)
    if(user.birthDate === ""){
      apiErrors.birthDate = "Votre date de naissance est obligatoire"
      setErrors(apiErrors)
      return
    }
    try{
      await userAPI.register(user);
      // //on "vide" les erreurs
      setErrors({})
      // //notification toast:
      toast.success("Votre compte est bien créé ! Connectez vous")
      // //redirection vers la page de login :
      history.replace('/login')
    }catch(error){
      console.log(error.response)
      const {violations} = error.response.data;
      if(violations){
        violations.forEach(violation => {
          apiErrors [violation.propertyPath] = violation.message
        });
        setErrors(apiErrors)
      }
    }
    // console.log(user);
  };

  //----------------------------------------------EFFECTS :
  useEffect(()=>{
    if(logedInModal){
      setLogedInModal(false)
      // Notification Toast :
      toast.success("Vous êtes connecté ! À vous de jouer 🎸 🎹")
      history.push("/profils")
    }
  },[logedInModal])
  
  //----------------------------------------------RETURN :
  return (
    <>
      <div className="fondPage bg-secondary p-4 d-flex align-items-center">
        <div className="container bg-light shadow rounded p-5">
          <h1>Inscription sur ZicoS</h1>
          <p className="text-center">Pour créer votre profil et découvrir des groupes ou musiciens.nes, vous dévez d'abord créer un compte si vous n'en avez pas.</p>
          <div className="d-flex justify-content-center">
            <Button
              onClick={() => setOpen(!open)}
              aria-controls="example-collapse-text"
              aria-expanded={open}
              className="mx-2"
            >
              Créez votre compte
            </Button>
            <LoginModal libBtn="J'ai déjà un compte" variant="link"/>
          </div>         
          <Collapse in={open}>
            <div id="example-collapse-text">
              <form onSubmit={handleSubmit}>
                <div className="row mt-4">
                  <div className="col">
                    <Field
                      name="email"
                      label="Votre adresse email"
                      placeholder="Entrez votre adresse email"
                      type="email"
                      error={errors.email}
                      value={user.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col">
                    <Field
                      name="birthDate"
                      label="Votre date de naissance"
                      type="date"
                      error={errors.birthDate}
                      value={user.birthDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <Field
                  name="password"
                  label="Votre mot de passe"
                  placeholder="Entrez un mot de passe sécurisé d'au moins 8 caractères"
                  type="password"
                  error={errors.password}
                  value={user.password}
                  onChange={handleChange}
                />
                <Field
                  name="passwordConfirm"
                  label="Confirmez votre mot de passe"
                  placeholder="Confirmez votre mot de passe"
                  type="password"
                  error={errors.passwordConfirm}
                  value={user.passwordConfirm}
                  onChange={handleChange}
                />
                  <Form.Group className="d-flex">
                    <Form.Check
                      required
                      onChange={handleTermsValidation}
                      label={"J'ai lu et j'accepte les" + " "}
                      isInvalid={termsValidation}
                      feedback="Vous devez accepter les conditions générales d'utilisation pour créer un compte"
                    />
                    <Button variant="link" onClick={handleShow} className="ml-1 border-0 p-0">
                      conditions générales d'utilisation
                    </Button>
                  </Form.Group>

                <button type="submit" className="btn btn-success">
                    Confirmation
                </button>
              </form>
            </div>
          </Collapse>
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header className="bg-primary text-light" closeButton>
              <Modal.Title >Conditions générales d'utilisation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="cgu text-justify">
                  <p className="text-center">
                      Les présentes conditions générales d'utilisation (CGU) ont pour objet de définir les modalités de mise à disposition du site ZicoS et les conditions d'utilisation de ZicoS par l'Utilisateur
                  </p>
                  <h2 className="text-primary mt-3">
                      Acceptation :
                  </h2>
                  <p>
                      La création d'un compte sur ZicoS nécessite l'acceptation pleine et entière des présentes CGU par l'utilisateur. Le non-respect des présentes CGU peut entrainer une suspension voir une supression du compte utilisateur.
                  </p>
                  <h2 className="text-primary mt-3">
                      But du service :
                  </h2>
                  ZicoS est un site internet dont le but est de mettre en relation des groupes de musique et des musiciens.nes dans l'objectif de se rencontrer et de jouer de la musique ensemble.
                  <h2 className="text-primary mt-3">
                      Utilisation :
                  </h2>
                  L'utilisateur s'engage à n'utiliser ZicoS que dans le cadre du but du service : mettre en relation des groupes et des musiciens.nes et en aucun cas pour toute autre activité. L'utilisateur s'engage notamment à ne pas utiliser ZicoS pour des activités illégales. Dans un tel cas, ZicoS se réserve le droit de signaler l'utilisateur aux autorités compétentes.
                  <h2 className="text-primary mt-3">
                      Conditions :
                  </h2>
                  L'utilisateur s'engage à respecter les CGU de ZicoS tant qu'il disposera d'un compte utilisateur sur ZicoS. L'utilisateur peut à tout moment supprimer son compte.
                  <h2 className="text-primary mt-3">
                      Données personnelles :
                  </h2>
                  Une adresse email et une date de naissance sont nécessaires pour créer un compte ZicoS.
                  ZicoS n'utilise pas ces données à des fins commerciales ou publicitaires et ne les communique à aucun tier. L'adresse email est nécessaire pour permettre la communication entre les utilisateurs de ZicoS. ZiocS se réserve le droit d'utiliser ces données à des fins promotionnelles ou de communication uniquement avec ses utilisateurs.
                  <h2 className="text-primary mt-3">
                      Communication :
                  </h2>
                  ZicoS se réserve le droit de communiquer avec ses utilisateurs via l'adresse email renseignée à la création du compte.
                  <h2 className="text-primary mt-3">
                      Propriété intellectuelle :
                  </h2>
                  Les contenus diffusés sur ZicoS appartiennent à l'utilisateur qui les diffuse (voire CGU). 
                  ZicoS se réserve toutefois le droit de les utiliser à des fins promotionnelles ou de communication.
                  
                  <h2 className="text-primary mt-3">
                      Contenus et diffusions :
                  </h2>
                  L'utilisateur est responsable des contenus qu'il diffuse sur ZicoS et s'engage à respecter les règles suivantes :
                      <ul>
                          <li>ne pas diffuser de contenu choquant, violent ou illégal</li>
                          <li>ne pas diffuser de contenu ayant un lien avec des activités ou actes illégaux</li>
                          <li>ne pas faire l'appologie d'activités ou actes illégaux</li>
                      </ul>

                  ZicoS se réserve le droit de supprimer tout contenu ne respectant pas ces conditions et de suspendre voir supprimer le compte de l'utilisateur. En cas de diffusion de contenu sortant du cadre prévu par la loi, ZicoS se réserve le droit de signaler l'utilisateur aux autorités compétentes
                  <h4>
                      Les contenus concernés sont :
                  </h4>
                  <ul>
                      <li>photo de profil</li>
                      <li>textes de présentation</li>
                      <li>liens vers d'autres sites</li>
                      <li>contenu multimédia (video, audio)</li>
                  </ul>

                      
                  Voici une liste non exhaustive du type de Contenu qui est illégal et interdit sur ZicoS. ZicoS se réserve le droit d’enquêter et de prendre les mesures légales appropriées à sa seule discrétion, contre quiconque violant ces modalités, y compris et sans s’y limiter, en retirant immédiatement le contenu offensant de ZicoS et en mettant fin à l’adhésion des personnes responsables. Sont considérés comme notoirement offensants envers les utilisateurs en ligne les propos et contenus de type suivant:
                  <ul>
                      <li>qui incitent au racisme, au sectarisme, à la haine ou à la violence physique de toutes sortes, contre n’importe quel groupe ou n’importe quel individu</li>
                      <li>qui harcèlent ou appellent au harcèlement d’une tierce personne</li>
                      <li>qui impliquent la transmission d’« emails non sollicités» : de « chaines de lettres » ; de publipostages non sollicités ou de « spams »</li>
                      <li>qui contiennent des informations que vous savez fausses, trompeuses, ou qui favorisent des activités illégales ou encouragent un comportement abusif, menaçant, obscène, diffamatoire ou calomnieux</li>
                      <li>qui présentent une copie illégale ou non autorisée par l’auteur de son oeuvre protégée par le droit d’auteur, comme la mise à disposition de programmes informatiques piratés ou de liens y renvoyant, la mise à disposition d’informations destinés à contourner les dispositifs destinés à protéger contre toute copie, ou la mise à disposition de fichiers de musique piratée ou de liens y renvoyant</li>
                      <li>qui contiennent des pages à accès restreint ou accessibles uniquement par mots de passe, ou des images et pages dissimulées (qui ne contiennent pas de liens vers ou provenant d'une autre page accessible)</li>
                      <li>qui mettent à disposition du matériel pornographique ou violent qui met en scène des individus âgés de moins de 18 ans ou qui sollicite des informations aux personnes âgées de moins de 18 ans</li>
                      <li>qui fournissent des informations quant à toute activité illégale, telles que la fabrication ou l’achat d’armes, la violation de la vie privée, ou la création et diffusion de virus informatiques </li>
                      <li>qui sollicitent auprès d’autres utilisateurs des mots de passe ou des informations d’identification personnelles à des fins commerciales ou illicites</li>
                      <li>qui mènent des activités commerciales et/ou activités de vente sans notre consentement écrit préalable, tels que des concours, loteries, troc, publicité, et vente pyramidale.</li>
                  </ul>

                  <h4>
                      Liens hypertextes :
                  </h4>
                  Via les profils des utilisateurs ZicoS peut être amené à diffuser des liens hypertextes vers des sites web édités et/ou gérés par des tiers.
                  Dans la mesure où aucun contrôle n’est exercé sur ces ressources externes, l’Utilisateur reconnaît queZicoS n’assume aucune responsabilité relative à la mise à disposition de ces ressources, et ne peut être tenue responsable quant à leur contenu.

                  <h2 className="text-primary mt-3">
                      Modification des CGU :
                  </h2>
                  En cas de modification des CGU, ZicoS communiquera les CGU modifiées à ses utilisateurs par le biais de l'adresse email renseignée lors de la création du compte

              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleClose}>
                Fermer
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;

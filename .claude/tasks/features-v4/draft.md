- [x] Dans la configuration de la liste déroulante (src/lib/form-fields/field-configurator/select), supprime la possibilité d'importer des options à travers un fichier csv et tout le code et les références à ça.
- [x] Dans la configuration de la liste déroulante (src/lib/form-fields/field-configurator/select), les deux boutton radio 'Choix unique' et 'Choix multiple', permettron à l'utilisateur de configure sa liste:
  - Si Choix unique, on garde le comportement actuel de select
  - Si Choix multiple, il faut que tu ajoute un checkbox à côté de chaque option
  - Attention il faut que ça aussi au niveau de bloc Prévisualisation en fonction de ce qu'on séléctionner (unique ou multiple)
- [x] Dans la configuration de la liste déroulante (src/lib/form-fields/field-configurator/select), actuellement dans db.json, on peut alimenter les options a travers un array json, ex:
      "addresses": [
      {
      "value": "paris",
      "label": "Paris"
      },
      {
      "value": "lyon",
      "label": "Lyon"
      }
      ]
      Change cette structure comme ça:
      "option": {
      "addresses": {
      label: "Adresse",
      data: [
      {
      label: "Rues",
      items: [
      {
      "value": "street1",
      "label": "Street 1"
      },
      {
      "value": "street2",
      "label": "Street 2"
      }
      ]
      },
      {
      label: "Codes postaux",
      items: [
      {
      "value": "code1",
      "label": 78210
      },
      {
      "value": "code2",
      "label": "78211"
      }
      ]
      }
      ]

      },

      "users": {
          label: "Utilisateurs",
          data: [
              {
                  label: "Ids",
                  items: [
                      {
                      "value": "id1",
                      "label": "ID 1"
                      },
                      {
                      "value": "id2",
                      "label": "ID 2"
                      }
                  ]
              },
              {
                  label: "Noms",
                  items: [
                      {
                      "value": "nom1",
                      "label": "Nom 1"
                      },
                      {
                      "value": "nom2",
                      "label": "Nom2"
                      }
                  ]
              }
          ]

      },

}
Le premier select 'type de données' doit afficher dans ce cas "Adresse" ou "Utilisateurs": - Si "Adresse", le deuxieme select 'Source de données' (et donc il faut supprimer le type text lien api et le remplacer par un select) doit afficher 'Rues' et 'Codes postaux', et dans ce cas si on choisi Rues, la pré visualisation doit afficher Street 1 et Street 2 comme options, si on choisi 'Codes postaux' la pré visualisation doit afficher 78210 et 78211 comme options - Si "Utilisateurs", le deuxieme select 'Source de données' (et donc il faut supprimer le type text lien api et le remplacer par un select) doit afficher 'Ids' et 'Noms', et dans ce cas si on choisi Ids, la pré visualisation doit afficher ID 1 et ID 2 comme options, si on choisi 'Noms' la pré visualisation doit afficher Nom 1 et Nom 2 comme options
J'ai donné juste un exemple du shéma de db.json, tu peux changer la structure si tu penses qu'il une structuration plus adapté et pense à créer un fichier de documentation pour cette fonctionalité

---

- [x] Après développement du fonctionalité précédente, lorsqu'on charge les options à partir d'une source de données, pas la peine d'afficher les options dans le bloc à droite (ConfiguratorField), il sont déja présent dans le modal Pré visualisation, et pour le choix de la valeur par défaut dans le checkbox 'Définir une valeur par défault', lorsque clique sur ce checkbox on remplace le checkbox 'Définir une valeur par défault' par une liste select qui permet de choisir une option par défaut parmi la liste chargée
- [x] Il faut replacer les champs 'Nombre' (src/lib/form-fields/field-configurator/number) et 'Quantité avec unité' (src/lib/form-fields/field-configurator/unit) par un champs unique 'Nombre', pour ça il faut ajouter une option au champs 'Unité' qui est 'sans unité', cela rend le champs de type number
- [x] Dans le header (src/lib/form-fields/field-configurator/common/Header.tsx), ajoute une icone fleche vers le haut, une icone flech vers le bas et une icone drag and drop qui permet tout simplement de déplacer une carte vers un emplacement voulu (il faut maintenir la souris cliquer pour déplacer), cela permettra de changer l'ordre d'affichage des FieldConfigurator, attention, lors du changement du l'order dans la config on doit voir ça aussi au niveau du bloc pré visualisation (ces icones de drag ne sont pas visible que si on hover sur le Header)
- [x] Dans le header (src/lib/form-fields/field-configurator/common/Header.tsx), afficher un modal de confirmation pour demander à l'utilisateur s'il veut vraiment supprimer un champs
- [x] Dans le header (src/lib/form-fields/field-configurator/common/Header.tsx), si l'utilisateur clique sur l'icone duplicate, il faut afficher un tag a code du titre (Champ libre par exemple), pour que l'utilisateur sache que ce champs a été dupliquer, c'est qu'au moment ou l'utilisateur commence à modifier ce champ dupliqué que ce tag disparaitra
- [x] Supprime le bloc des statistique (StatCard component) et toutes les données qui sont liée à ça dans l'onglet a droite dans http://localhost:3000/ (et vide les données du store s'il y en a)
- [x] Fixe la valeur par défaut du champs date: je choisi 'Date du jour', dans pré visualition c'est bon je peux voir cette date, mais je retourne à Aucune, Prévisualisation affiche toujours la date d'aujourd'hui
- [x] La description d'un champs doit qu'on a configurer doit être afficher en tant que tooltip lors du hover sur ce champs soit dans Pré visualisation ou bien lorsque crée une déclaration a partir d'un formulaire (voir ce tooltip dans le design system)
- dans la liste des déclaration (http://localhost:3000/) il faut centrer la liste des déclarations avec un max width de 602px, par contre si le modal 'nouvelle decalaration', il faut supprimer l'overlay de tel sorte qu'on peut naviguer entre les déclarations, voir les details dans le modal sans le fermer
- [x] dans la liste des déclaration (http://localhost:3000/admin/parametrage-declaratif) il faut centrer le bloc 'Nouveau formulaire' avec un max width de 602px, par contre si le modal 'Prévisualisation' s'ouvre, il faut déplacer 'Nouveau formulaire' à gauche de tel sorte de gagner l'espace et avoir les deux visibles en meme temps
- [x] Continuer le champs import (dans FieldConfigurator) qui permet d'importer un fichier quelconques
- [x] use context7

var InvitationModel = require('../models/invitation').InvitationModel;
var Mailer = require('../helpers/mailer');


module.exports = function (app){
 
  app.get('/invitations/create',  function (req, res, next) {
    res.render('invitations/create', {title: 'Invitar personas a unirse a giombu', user:req.session.user});
  });

  app.post('/invitations/add', function (req, res, next) {
   var invitation_new = new InvitationModel(req.param('invitation'));
    invitation_new.user = req.session.user._id;
   // var invitation = new InvitationModel(req.param('invitation'));

    InvitationModel.findOne({ user: req.session.user._id }).where('email').equals(invitation_new.email).exec(function (err, invitation) {
       if(!err){
          if (invitation){
         res.render('invitations/create', {title: 'Cargar Invitacion' , user:req.session.user, messagge : "Ya Has invitado a: "+ invitation_new.email});
        }else{
          invitation_new.save(function(err){
          if(!err){
               var body = "Has sido invitado a formar parte de la comunidad Giombu, una comunidad de comercio electrónico en pleno crecimiento. ¡Esperamos que tu tambien quieras formar parte de esto! Para ingresar, por favor sigue el link debajo.";
               body += '"'+ invitation_new.body +'"';
               if(invitation_new.invitation_type == 'user'){
                  var html_content = "<a href='http://localhost:3000/users/accept_invitation/"+invitation_new._id+"'>Click Aquí para comenzar a ser parte de GIOMBU</a>";
               }else{
                  var html_content = "<a href='http://localhost:3000/users/accept_promoter_invitation/"+invitation_new._id+"'>Click Aquí para comenzar a ser parte de GIOMBU</a>";
               }
               var subject = invitation_new.subject;
               var mails = invitation_new.email;
               var from_name = req.session.user.name ;
               var from_mail = req.session.user.email ;
               Mailer.send_mail( mails , subject, body, from_name, from_mail, html_content);
               console.log(html_content)
              console.log(invitation_new);
              res.render('invitations/create', {title: 'Cargar Invitacion' , user:req.session.user, messagge : "Invitacion enviada con éxito a: "+ invitation_new.email});
            } else {
              console.log("Error: - " + err);
              res.render('invitations/create', {title: 'Cargar Invitacion' , user:req.session.user, messagge : "Error: "+ err});
            }
          });
         }
       } else {
          console.log("Error: - " + err);
           res.redirect('back');
     
        }
       
    });
  });



 app.get('/intranet/invitations/list_promoters', function(req, res, next){
    InvitationModel.find().where('user').equals(req.session.user._id).where('invitation_type').equals('promoter').exec(function(err, invitations){
      if(!err){
        if(invitations){
          console.log('invitation - list - Se envian los invitations encontrados');
          console.log(invitations);
          res.render('invitations/list', {title: 'Lista de Invitaciones', user:req.session.user,invitations : invitations});
        }else{
          res.render('invitations/list', {title: 'Lista de Invitaciones', user:req.session.user, invitations: invitations, error: "No se han encontrado invitaciones"});
        }
      }else{
        console.log('invitation - list - '.red.bold + err);
      }
    });
  });

  app.get('/intranet/invitations/list_contacts', function(req, res, next){
    InvitationModel.find().where('user').equals(req.session.user._id).where('invitation_type').equals('user').exec(function(err, invitations){
      if(!err){
        if(invitations){
          console.log('invitation - list - Se envian los invitations encontrados');
          console.log(invitations);
          res.render('invitations/list', {title: 'Lista de Invitaciones', user:req.session.user,invitations : invitations});
        }else{
          res.render('invitations/list', {title: 'Lista de Invitaciones', user:req.session.user, invitations: invitations, error: "No se han encontrado invitaciones"});
        }
      }else{
        console.log('invitation - list - '.red.bold + err);
      }
    });
  });

  app.get('/intranet/invitations/view',function(req, res, next){
    console.log('invitations - view'.cyan.bold);
    console.log('invitations - view - Busco el invitation ( ' + req.params.id +' )');
    InvitationModel.findById( req.params.id , function(err, invitation){
      if(!err){
        if(invitation){
          console.log('invitations - view - Se encontro el invitation ( ' + req.params.id +' )');
          res.render('invitations/view', { title: 'invitation',
                          invitation : invitation,
                          user : req.session.user
                        });
        }else{
          console.log('invitations - view - No se encontro el invitation ( ' + req.params.id +' )');
        }
      }else{
        console.log('invitations - view - '.red.bold + err);
      }
    });
  });
}
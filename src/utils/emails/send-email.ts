import * as AWS from "aws-sdk";
import * as fs from 'fs';
import logger from "../logger";
import Mail = require("nodemailer/lib/mailer");
import MailComposer = require("nodemailer/lib/mail-composer");

type EmailSentTo = 'salon' | 'user' | 'admin' | 'employee'
type EmailType = 'booking requested' | 'booking confirmed' | 'signup' | 'booking completed' | 'forgot password'

export default class SendEmail {

    /**
     * @description send email with invoice to customer and vendor
     */
    static bookingComplete = async () => {
        fs.readFile(`${__dirname}/vendor-invoice.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            console.log(data)
        })
        const mailOptions: Mail.Options ={
            from: 'source@example.com',
            replyTo: 'source@example.com',
            to: 'bob@example.com',
            subject: 'Sample SES message with attachment',
            text: 'Hey folks, this is a test message from SES with an attachment.',
            attachments: [
              {
                path: '/tmp/file.docx'
              },
            ],
          }
        const mail = new MailComposer(mailOptions);
    }

    static bookingConfirm = async (salonEmail: string, salonName: string, bookingId: string, bookingIdNumeric: string, dateTime: string) => {

        fs.readFile(`${__dirname}/booking-confirm.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            if (err) {
                SendEmail.logEmailStatus(false, 'booking confirmed', 'salon', salonEmail, err.message)
                return
            }else{

            }
            // TODO: string interpolation for the html content

            const params = {
                Destination: { /* required */
                    ToAddresses: [
                        'preetsc27@gmail.com',
                        'kashish@zattire.com',
                        'pushaan@zattire.com',
                        'developers@zattire.com',
                        salonEmail
                        /* more items */
                    ]
                },
                Message: { /* required */
                    Body: { /* required */
                        Html: {
                            Charset: "UTF-8",
                            Data: data
                        },
                        Text: {
                            Charset: "UTF-8",
                            Data: "Hello!\n Welcome to Zattire. 33"
                        }
                    },
                    Subject: {
                        Charset: 'UTF-8',
                        Data: 'Welcome to zattire'
                    }
                },
                Source: 'preet@zattire.com', /* required */
                ReplyToAddresses: [
                    'preet@zattire.com',
                    /* more items */
                ],
            };

            // Create the promise and SES service object
            var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

            // Handle promise's fulfilled/rejected states
            sendPromise.then(
                function (data) {
                    SendEmail.logEmailStatus(true, 'booking confirmed', 'salon', salonEmail, data.MessageId)
                }).catch(
                    function (err) {
                        SendEmail.logEmailStatus(false, 'booking confirmed', 'salon', salonEmail, err.message)
                    });
        })

    }

    static emailConfirm = async (userEmail: string) => {

        fs.readFile(`${__dirname}/email-confirm.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            if (err) {
                SendEmail.logEmailStatus(false, 'signup', 'user', userEmail, err.message)
                return
            }

            // TODO: string interpolation for the html content

            const params = {
                Destination: { /* required */
                    ToAddresses: [
                        'preetsc27@gmail.com',
                        'kashish@zattire.com',
                        'pushaan@zattire.com',
                        'developers@zattire.com',
                        userEmail
                        /* more items */
                    ]
                },
                Message: { /* required */
                    Body: { /* required */
                        Html: {
                            Charset: "UTF-8",
                            Data: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

                            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
                            <head>
                            <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
                            <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
                            <meta content="width=device-width" name="viewport"/>
                            <!--[if !mso]><!-->
                            <meta content="IE=edge" http-equiv="X-UA-Compatible"/>
                            <!--<![endif]-->
                            <title></title>
                            <!--[if !mso]><!-->
                            <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css"/>
                            <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css"/>
                            <!--<![endif]-->
                            <style type="text/css">
                                    body {
                                        margin: 0;
                                        padding: 0;
                                    }
                            
                                    table,
                                    td,
                                    tr {
                                        vertical-align: top;
                                        border-collapse: collapse;
                                    }
                            
                                    * {
                                        line-height: inherit;
                                    }
                            
                                    a[x-apple-data-detectors=true] {
                                        color: inherit !important;
                                        text-decoration: none !important;
                                    }
                                </style>
                            <style id="media-query" type="text/css">
                                    @media (max-width: 855px) {
                            
                                        .block-grid,
                                        .col {
                                            min-width: 320px !important;
                                            max-width: 100% !important;
                                            display: block !important;
                                        }
                            
                                        .block-grid {
                                            width: 100% !important;
                                        }
                            
                                        .col {
                                            width: 100% !important;
                                        }
                            
                                        .col_cont {
                                            margin: 0 auto;
                                        }
                            
                                        img.fullwidth,
                                        img.fullwidthOnMobile {
                                            max-width: 100% !important;
                                        }
                            
                                        .no-stack .col {
                                            min-width: 0 !important;
                                            display: table-cell !important;
                                        }
                            
                                        .no-stack.two-up .col {
                                            width: 50% !important;
                                        }
                            
                                        .no-stack .col.num2 {
                                            width: 16.6% !important;
                                        }
                            
                                        .no-stack .col.num3 {
                                            width: 25% !important;
                                        }
                            
                                        .no-stack .col.num4 {
                                            width: 33% !important;
                                        }
                            
                                        .no-stack .col.num5 {
                                            width: 41.6% !important;
                                        }
                            
                                        .no-stack .col.num6 {
                                            width: 50% !important;
                                        }
                            
                                        .no-stack .col.num7 {
                                            width: 58.3% !important;
                                        }
                            
                                        .no-stack .col.num8 {
                                            width: 66.6% !important;
                                        }
                            
                                        .no-stack .col.num9 {
                                            width: 75% !important;
                                        }
                            
                                        .no-stack .col.num10 {
                                            width: 83.3% !important;
                                        }
                            
                                        .video-block {
                                            max-width: none !important;
                                        }
                            
                                        .mobile_hide {
                                            min-height: 0px;
                                            max-height: 0px;
                                            max-width: 0px;
                                            display: none;
                                            overflow: hidden;
                                            font-size: 0px;
                                        }
                            
                                        .desktop_hide {
                                            display: block !important;
                                            max-height: none !important;
                                        }
                                    }
                                </style>
                            </head>
                            <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #ffffff;">
                            <!--[if IE]><div class="ie-browser"><![endif]-->
                            <table bgcolor="#ffffff" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; width: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td style="word-break: break-word; vertical-align: top;" valign="top">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#ffffff"><![endif]-->
                            <div style="background-image:url('https://zattire-images.s3.ap-south-1.amazonaws.com/email-assets/wlcm3.png');background-position:top center;background-repeat:no-repeat;background-color:transparent;">
                            <div class="block-grid" style="min-width: 320px; max-width: 835px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-image:url('images/wlcm3.png');background-position:top center;background-repeat:no-repeat;background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:835px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="835" style="background-color:transparent;width:835px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:10px; padding-bottom:5px;"><![endif]-->
                            <div class="col num12" style="min-width: 320px; max-width: 835px; display: table-cell; vertical-align: top; width: 835px;">
                            <div class="col_cont" style="width:100% !important;">
                            <!--[if (!mso)&(!IE)]><!-->
                            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:10px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                            <!--<![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="335" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 335px; width: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td height="335" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                            </tr>
                            </tbody>
                            </table>
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px; font-family: 'Trebuchet MS', Tahoma, sans-serif"><![endif]-->
                            <div style="color:#024959;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:1.2;padding-top:20px;padding-right:10px;padding-bottom:20px;padding-left:10px;">
                            <div style="line-height: 1.2; font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #024959; mso-line-height-alt: 14px;">
                            <p style="font-size: 22px; line-height: 1.2; word-break: break-word; text-align: center; font-family: Montserrat, 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 26px; margin: 0;"><span style="font-size: 22px; color: #024959;"><strong>Before getting your first service</strong></span></p>
                            </div>
                            </div>
                            <!--[if mso]></td></tr></table><![endif]-->
                            <!--[if (!mso)&(!IE)]><!-->
                            </div>
                            <!--<![endif]-->
                            </div>
                            </div>
                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                            </div>
                            </div>
                            <div style="background-color:transparent;">
                            <div class="block-grid two-up no-stack" style="min-width: 320px; max-width: 835px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:835px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="417" style="background-color:transparent;width:417px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                            <div class="col num6" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 414px; width: 417px;">
                            <div class="col_cont" style="width:100% !important;">
                            <!--[if (!mso)&(!IE)]><!-->
                            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 10px; padding-left: 0px;">
                            <!--<![endif]-->
                            <div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Alternate text" border="0" class="center autowidth" src="https://zattire-images.s3.ap-south-1.amazonaws.com/email-assets/nl02.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 303px; display: block;" title="Alternate text" width="303"/>
                            <!--[if mso]></td></tr></table><![endif]-->
                            </div>
                            <!--[if (!mso)&(!IE)]><!-->
                            </div>
                            <!--<![endif]-->
                            </div>
                            </div>
                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                            <!--[if (mso)|(IE)]></td><td align="center" width="417" style="background-color:transparent;width:417px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                            <div class="col num6" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 414px; width: 417px;">
                            <div class="col_cont" style="width:100% !important;">
                            <!--[if (!mso)&(!IE)]><!-->
                            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                            <!--<![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="5" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 5px; width: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td height="5" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                            </tr>
                            </tbody>
                            </table>
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: 'Trebuchet MS', Tahoma, sans-serif"><![endif]-->
                            <div style="color:#555555;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                            <div style="line-height: 1.2; font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #555555; mso-line-height-alt: 14px;">
                            <p style="font-size: 16px; line-height: 1.2; word-break: break-word; text-align: left; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 19px; margin: 0;"><span style="font-size: 16px;">Sign up to start your journey</span></p>
                            <p style="font-size: 16px; line-height: 1.2; word-break: break-word; text-align: left; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 19px; margin: 0;"><span style="font-size: 16px;">with us and to get all the</span></p>
                            <p style="font-size: 16px; line-height: 1.2; word-break: break-word; text-align: left; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 19px; margin: 0;"><span style="font-size: 16px;">latest updates.</span></p>
                            </div>
                            </div>
                            <!--[if mso]></td></tr></table><![endif]-->
                            <div align="left" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="left"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:38.25pt; width:145.5pt; v-text-anchor:middle;" arcsize="26%" stroke="false" fillcolor="#f2c777"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#000000; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
                            <div style="text-decoration:none;display:inline-block;color:#000000;background-color:#f2c777;border-radius:13px;-webkit-border-radius:13px;-moz-border-radius:13px;width:auto; width:auto;;border-top:1px solid #f2c777;border-right:1px solid #f2c777;border-bottom:1px solid #f2c777;border-left:1px solid #f2c777;padding-top:10px;padding-bottom:10px;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:15px;padding-right:15px;font-size:16px;display:inline-block;"><span style="font-size: 16px; margin: 0; line-height: 2; word-break: break-word; font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; mso-line-height-alt: 32px;"><em>Confirm </em><em>your </em><em>email</em></span></span></div>
                            <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                            </div>
                            <!--[if (!mso)&(!IE)]><!-->
                            </div>
                            <!--<![endif]-->
                            </div>
                            </div>
                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                            </div>
                            </div>
                            <div style="background-color:transparent;">
                            <div class="block-grid" style="min-width: 320px; max-width: 835px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:835px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="835" style="background-color:transparent;width:835px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                            <div class="col num12" style="min-width: 320px; max-width: 835px; display: table-cell; vertical-align: top; width: 835px;">
                            <div class="col_cont" style="width:100% !important;">
                            <!--[if (!mso)&(!IE)]><!-->
                            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                            <!--<![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                            <table align="left" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                            </tr>
                            </tbody>
                            </table>
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <!--[if (!mso)&(!IE)]><!-->
                            </div>
                            <!--<![endif]-->
                            </div>
                            </div>
                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                            </div>
                            </div>
                            <div style="background-color:transparent;">
                            <div class="block-grid two-up no-stack" style="min-width: 320px; max-width: 835px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:835px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="417" style="background-color:transparent;width:417px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                            <div class="col num6" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 414px; width: 417px;">
                            <div class="col_cont" style="width:100% !important;">
                            <!--[if (!mso)&(!IE)]><!-->
                            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                            <!--<![endif]-->
                            <div align="center" class="img-container center autowidth" style="padding-right: 10px;padding-left: 0px;">
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 10px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Alternate text" border="0" class="center autowidth" src="https://zattire-images.s3.ap-south-1.amazonaws.com/email-assets/nl03.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 303px; display: block;" title="Alternate text" width="303"/>
                            <!--[if mso]></td></tr></table><![endif]-->
                            </div>
                            <!--[if (!mso)&(!IE)]><!-->
                            </div>
                            <!--<![endif]-->
                            </div>
                            </div>
                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                            <!--[if (mso)|(IE)]></td><td align="center" width="417" style="background-color:transparent;width:417px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                            <div class="col num6" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 414px; width: 417px;">
                            <div class="col_cont" style="width:100% !important;">
                            <!--[if (!mso)&(!IE)]><!-->
                            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                            <!--<![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="5" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 5px; width: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td height="5" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                            </tr>
                            </tbody>
                            </table>
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: 'Trebuchet MS', Tahoma, sans-serif"><![endif]-->
                            <div style="color:#555555;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                            <div style="line-height: 1.2; font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #555555; mso-line-height-alt: 14px;">
                            <p style="font-size: 16px; line-height: 1.2; word-break: break-word; text-align: left; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 19px; margin: 0;"><span style="font-size: 16px;">Find a salon that suits you and</span><br/><span style="font-size: 16px;">connect with them. Once you’re satisfied, you are ready to get the services for you.</span></p>
                            </div>
                            </div>
                            <!--[if mso]></td></tr></table><![endif]-->
                            <div align="left" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="left"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:38.25pt; width:138pt; v-text-anchor:middle;" arcsize="26%" stroke="false" fillcolor="#f2c777"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#000000; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
                            <div style="text-decoration:none;display:inline-block;color:#000000;background-color:#f2c777;border-radius:13px;-webkit-border-radius:13px;-moz-border-radius:13px;width:auto; width:auto;;border-top:1px solid #f2c777;border-right:1px solid #f2c777;border-bottom:1px solid #f2c777;border-left:1px solid #f2c777;padding-top:10px;padding-bottom:10px;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span style="font-size: 16px; margin: 0; line-height: 2; word-break: break-word; font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; mso-line-height-alt: 32px;"><em>Start Exploring</em></span></span></div>
                            <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                            </div>
                            <!--[if (!mso)&(!IE)]><!-->
                            </div>
                            <!--<![endif]-->
                            </div>
                            </div>
                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                            </div>
                            </div>
                            <div style="background-color:transparent;">
                            <div class="block-grid" style="min-width: 320px; max-width: 835px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:835px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="835" style="background-color:transparent;width:835px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                            <div class="col num12" style="min-width: 320px; max-width: 835px; display: table-cell; vertical-align: top; width: 835px;">
                            <div class="col_cont" style="width:100% !important;">
                            <!--[if (!mso)&(!IE)]><!-->
                            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                            <!--<![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                            </tr>
                            </tbody>
                            </table>
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <!--[if (!mso)&(!IE)]><!-->
                            </div>
                            <!--<![endif]-->
                            </div>
                            </div>
                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                            </div>
                            </div>
                            <div style="background-color:transparent;">
                            <div class="block-grid two-up no-stack" style="min-width: 320px; max-width: 835px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:835px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="417" style="background-color:transparent;width:417px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                            <div class="col num6" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 414px; width: 417px;">
                            <div class="col_cont" style="width:100% !important;">
                            <!--[if (!mso)&(!IE)]><!-->
                            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                            <!--<![endif]-->
                            <div align="center" class="img-container center autowidth" style="padding-right: 10px;padding-left: 0px;">
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 10px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Alternate text" border="0" class="center autowidth" src="https://zattire-images.s3.ap-south-1.amazonaws.com/email-assets/nl04.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 303px; display: block;" title="Alternate text" width="303"/>
                            <!--[if mso]></td></tr></table><![endif]-->
                            </div>
                            <!--[if (!mso)&(!IE)]><!-->
                            </div>
                            <!--<![endif]-->
                            </div>
                            </div>
                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                            <!--[if (mso)|(IE)]></td><td align="center" width="417" style="background-color:transparent;width:417px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                            <div class="col num6" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 414px; width: 417px;">
                            <div class="col_cont" style="width:100% !important;">
                            <!--[if (!mso)&(!IE)]><!-->
                            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                            <!--<![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="5" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 5px; width: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td height="5" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                            </tr>
                            </tbody>
                            </table>
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: 'Trebuchet MS', Tahoma, sans-serif"><![endif]-->
                            <div style="color:#555555;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                            <div style="line-height: 1.2; font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #555555; mso-line-height-alt: 14px;">
                            <p style="font-size: 16px; line-height: 1.2; word-break: break-word; text-align: left; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 19px; margin: 0;"><span style="font-size: 16px;">Fill in the details that you need and </span></p>
                            <p style="font-size: 16px; line-height: 1.2; word-break: break-word; text-align: left; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 19px; margin: 0;"><span style="font-size: 16px;">let them know you a </span></p>
                            <p style="font-size: 16px; line-height: 1.2; word-break: break-word; text-align: left; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 19px; margin: 0;"><span style="font-size: 16px;">little bit more.</span></p>
                            </div>
                            </div>
                            <!--[if mso]></td></tr></table><![endif]-->
                            <div align="left" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="left"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:38.25pt; width:143.25pt; v-text-anchor:middle;" arcsize="26%" stroke="false" fillcolor="#f2c777"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#000000; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
                            <div style="text-decoration:none;display:inline-block;color:#000000;background-color:#f2c777;border-radius:13px;-webkit-border-radius:13px;-moz-border-radius:13px;width:auto; width:auto;;border-top:1px solid #f2c777;border-right:1px solid #f2c777;border-bottom:1px solid #f2c777;border-left:1px solid #f2c777;padding-top:10px;padding-bottom:10px;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:15px;padding-right:15px;font-size:16px;display:inline-block;"><span style="font-size: 16px; margin: 0; line-height: 2; word-break: break-word; font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; mso-line-height-alt: 32px;"><em>Book Your Service</em></span></span></div>
                            <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                            </div>
                            <!--[if (!mso)&(!IE)]><!-->
                            </div>
                            <!--<![endif]-->
                            </div>
                            </div>
                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                            </div>
                            </div>
                            <div style="background-color:transparent;">
                            <div class="block-grid no-stack" style="min-width: 320px; max-width: 835px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:835px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="835" style="background-color:transparent;width:835px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                            <div class="col num12" style="min-width: 320px; max-width: 835px; display: table-cell; vertical-align: top; width: 835px;">
                            <div class="col_cont" style="width:100% !important;">
                            <!--[if (!mso)&(!IE)]><!-->
                            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                            <!--<![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                            </tr>
                            </tbody>
                            </table>
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Alternate text" border="0" class="center autowidth" src="https://zattire-images.s3.ap-south-1.amazonaws.com/email-assets/nl05.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 750px; display: block;" title="Alternate text" width="750"/>
                            <!--[if mso]></td></tr></table><![endif]-->
                            </div>
                            <!--[if (!mso)&(!IE)]><!-->
                            </div>
                            <!--<![endif]-->
                            </div>
                            </div>
                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                            </div>
                            </div>
                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <!--[if (IE)]></div><![endif]-->
                            </body>
                            </html>`
                        },
                        Text: {
                            Charset: "UTF-8",
                            Data: "Hello!\n Welcome to Zattire. 33"
                        }
                    },
                    Subject: {
                        Charset: 'UTF-8',
                        Data: 'Welcome to zattire'
                    }
                },
                Source: 'preet@zattire.com', /* required */
                ReplyToAddresses: [
                    'preet@zattire.com',
                    /* more items */
                ],
            };

            // Create the promise and SES service object
            var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

            // Handle promise's fulfilled/rejected states
            sendPromise.then(
                function (data) {
                    SendEmail.logEmailStatus(true, 'signup', 'user', userEmail, data.MessageId)
                }).catch(
                    function (err) {
                        SendEmail.logEmailStatus(false, 'signup', 'user', userEmail, err.message)
                    });
       

    })}


    static logEmailStatus = (success: boolean, emailType: EmailType, sentTo: EmailSentTo, receiverEmail: string, message: string) => {
        let startingMessage = "Email sent to"
        if (!success)
            startingMessage = "Error sending email to "
        logger.info(`${startingMessage} :: ${sentTo} :: ${emailType} :: ${receiverEmail} :: ${message}`)   
    }

    static forgotPasswordUser = async (userEmail: string, otp:string) => {

        fs.readFile(`${__dirname}/forgot-password-user.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            if (err) {
                SendEmail.logEmailStatus(false, 'forgot password', 'user', userEmail, err.message)
                return
            }
            // TODO: string interpolation for the html content
                console.log("sending emailll")
            const params = {
                Destination: { /* required */
                    ToAddresses: [
                        'preetsc27@gmail.com',
                        'kashish@zattire.com',
                        'pushaan@zattire.com',
                        'developers@zattire.com',
                        userEmail
                        /* more items */
                    ]
                },
                Message: { /* required */
                    Body: { /* required */
                        Html: {
                            Charset: "UTF-8",
                            Data: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

                            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
                            <head>
                            <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
                            <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
                            <meta content="width=device-width" name="viewport"/>
                            <!--[if !mso]><!-->
                            <meta content="IE=edge" http-equiv="X-UA-Compatible"/>
                            <!--<![endif]-->
                            <title></title>
                            <!--[if !mso]><!-->
                            <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css"/>
                            <!--<![endif]-->
                            <style type="text/css">
                                    body {
                                        margin: 0;
                                        padding: 0;
                                    }
                            
                                    table,
                                    td,
                                    tr {
                                        vertical-align: top;
                                        border-collapse: collapse;
                                    }
                            
                                    * {
                                        line-height: inherit;
                                    }
                            
                                    a[x-apple-data-detectors=true] {
                                        color: inherit !important;
                                        text-decoration: none !important;
                                    }
                                </style>
                            <style id="media-query" type="text/css">
                                    @media (max-width: 565px) {
                            
                                        .block-grid,
                                        .col {
                                            min-width: 320px !important;
                                            max-width: 100% !important;
                                            display: block !important;
                                        }
                            
                                        .block-grid {
                                            width: 100% !important;
                                        }
                            
                                        .col {
                                            width: 100% !important;
                                        }
                            
                                        .col_cont {
                                            margin: 0 auto;
                                        }
                            
                                        img.fullwidth,
                                        img.fullwidthOnMobile {
                                            max-width: 100% !important;
                                        }
                            
                                        .no-stack .col {
                                            min-width: 0 !important;
                                            display: table-cell !important;
                                        }
                            
                                        .no-stack.two-up .col {
                                            width: 50% !important;
                                        }
                            
                                        .no-stack .col.num2 {
                                            width: 16.6% !important;
                                        }
                            
                                        .no-stack .col.num3 {
                                            width: 25% !important;
                                        }
                            
                                        .no-stack .col.num4 {
                                            width: 33% !important;
                                        }
                            
                                        .no-stack .col.num5 {
                                            width: 41.6% !important;
                                        }
                            
                                        .no-stack .col.num6 {
                                            width: 50% !important;
                                        }
                            
                                        .no-stack .col.num7 {
                                            width: 58.3% !important;
                                        }
                            
                                        .no-stack .col.num8 {
                                            width: 66.6% !important;
                                        }
                            
                                        .no-stack .col.num9 {
                                            width: 75% !important;
                                        }
                            
                                        .no-stack .col.num10 {
                                            width: 83.3% !important;
                                        }
                            
                                        .video-block {
                                            max-width: none !important;
                                        }
                            
                                        .mobile_hide {
                                            min-height: 0px;
                                            max-height: 0px;
                                            max-width: 0px;
                                            display: none;
                                            overflow: hidden;
                                            font-size: 0px;
                                        }
                            
                                        .desktop_hide {
                                            display: block !important;
                                            max-height: none !important;
                                        }
                                    }
                                </style>
                            </head>
                            <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
                            <!--[if IE]><div class="ie-browser"><![endif]-->
                            <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td style="word-break: break-word; vertical-align: top;" valign="top">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
                            <div style="background-image:url('https://zattire-images.s3.ap-south-1.amazonaws.com/email-assets/fgt2.png');background-position:center top;background-repeat:no-repeat;background-color:transparent;">
                            <div class="block-grid no-stack" style="min-width: 320px; max-width: 545px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-image:url('images/fgt2.png');background-position:center top;background-repeat:no-repeat;background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:545px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="545" style="background-color:transparent;width:545px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                            <div class="col num12" style="min-width: 320px; max-width: 545px; display: table-cell; vertical-align: top; width: 545px;">
                            <div class="col_cont" style="width:100% !important;">
                            <!--[if (!mso)&(!IE)]><!-->
                            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                            <!--<![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="500" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 500px; width: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td height="500" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                            </tr>
                            </tbody>
                            </table>
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: 'Trebuchet MS', Tahoma, sans-serif"><![endif]-->
                            <div style="color:#393d47;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:1.2;padding-top:10px;padding-right:0px;padding-bottom:10px;padding-left:10px;">
                            <div style="line-height: 1.2; font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #393d47; mso-line-height-alt: 14px;">
                            <p style="font-size: 22px; line-height: 1.2; text-align: center; word-break: break-word; font-family: Montserrat, 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 26px; margin: 0;"><span style="font-size: 22px;">We received a request to reset your password.</span><br/><span style="font-size: 22px;">Please enter the OTP sent on your linked mobile </span><br/><span style="font-size: 22px;">number below to set up a new password.</span></p>
                            </div>
                            </div>
                            <!--[if mso]></td></tr></table><![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                            </tr>
                            </tbody>
                            </table>
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:30.75pt; width:167.25pt; v-text-anchor:middle;" arcsize="8%" stroke="false" fillcolor="#f2c777"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#000000; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
                            <div style="text-decoration:none;display:block;color:#000000;background-color:#f2c777;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;width:35%; width:35%;;border-top:0px solid #8a3b8f;border-right:0px solid #8a3b8f;border-bottom:0px solid #8a3b8f;border-left:0px solid #8a3b8f;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;">${otp}</span></span></div>
                            <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                            </div>
                            <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                            </tr>
                            </tbody>
                            </table>
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: 'Trebuchet MS', Tahoma, sans-serif"><![endif]-->
                            <div style="color:#393d47;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:1.2;padding-top:10px;padding-right:0px;padding-bottom:10px;padding-left:10px;">
                            <div style="line-height: 1.2; font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #393d47; mso-line-height-alt: 14px;">
                            <p style="font-size: 18px; line-height: 1.2; word-break: break-word; text-align: center; font-family: Montserrat, 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 22px; margin: 0;"><span style="font-size: 18px;">If you did not mean to reset your password then</span><br/><span style="font-size: 18px;">you can safely ignore this email.</span></p>
                            </div>
                            </div>
                            <!--[if mso]></td></tr></table><![endif]-->
                            <div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:30.75pt; width:162pt; v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#66806c"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
                            <div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#66806c;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:0px solid #8a3b8f;border-right:0px solid #8a3b8f;border-bottom:0px solid #8a3b8f;border-left:0px solid #8a3b8f;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;">Take me to the app</span></span></div>
                            <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                            </div>
                            <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="225" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 225px; width: 100%;" valign="top" width="100%">
                            <tbody>
                            <tr style="vertical-align: top;" valign="top">
                            <td height="225" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                            </tr>
                            </tbody>
                            </table>
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <!--[if (!mso)&(!IE)]><!-->
                            </div>
                            <!--<![endif]-->
                            </div>
                            </div>
                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                            </div>
                            </div>
                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <!--[if (IE)]></div><![endif]-->
                            </body>
                            </html>`
                        },
                        Text: {
                            Charset: "UTF-8",
                            Data: "Hello!\n Welcome to Zattire. 33"
                        }
                    },
                    Subject: {
                        Charset: 'UTF-8',
                        Data: 'Welcome to zattire'
                    }
                },
                Source: 'preet@zattire.com', /* required */
                ReplyToAddresses: [
                    'preet@zattire.com',
                    /* more items */
                ],
            };

            // Create the promise and SES service object
            var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

            // Handle promise's fulfilled/rejected states
            sendPromise.then(
                function (data) {
                    SendEmail.logEmailStatus(true, 'forgot password', 'user', userEmail, data.MessageId)
                }).catch(
                    function (err) {
                        SendEmail.logEmailStatus(false, 'forgot password', 'user', userEmail, err.message)
                    });
        })

    }

}

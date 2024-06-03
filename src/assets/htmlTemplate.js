export function htmlTemplate(senha_nova) {
  return `
  <!DOCTYPE html>
  <html>
  
  <head>
    <style>
      .body {
        z-index: 999;
        justify-self: center;
        position: fixed;
        align-items: center;
        text-align: center;
        background-color: white;
        padding: 80px;
        background: linear-gradient(150deg, rgba(21, 116, 208, 1) 0%, rgba(27, 19, 118, 1) 100%);
        background-attachment: fixed;
        align-content: center;
      }
  
      .button {
        display: inline-block;
        padding: 0.3em 1.2em;
        margin: 0 0.1em 0.1em 0;
        border: 0.16em solid rgba(255, 255, 255, 0);
        border-radius: 2em;
        box-sizing: border-box;
        text-decoration: none;
        font-family: 'Roboto', sans-serif;
        font-weight: 300;
        text-shadow: 0 0.04em 0.04em rgba(0, 0, 0, 0.35);
        text-align: center;
        transition: all 0.2s;
        background-color: rgba(27, 19, 118, 1);
      }
  
      .containerr {
        display: flex;
        padding-top: 30px;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: center;
        justify-content: center;
      }
  
      @media screen and (max-width: 768px) {
        .body {
          width: 90%;
        }
        .container {
          padding: 30px;
        }
        .body {
          padding: 20px;
        }
      }
  
      .code {
        display: inline-block;
        padding: 0.5em 3em;
        border: 0.16em solid #cfd1d4;
        margin: 0 0.3em 0.3em 0;
        box-sizing: border-box;
        text-decoration: none;
        font-family: 'Roboto', sans-serif;
        font-weight: 400;
        text-align: center;
        transition: all 0.15s;
      }
  
      .logo {
        max-width: 15%;
      }
    </style>
  </head>
  
  <div class="container"
    style="display: flex; justify-content: center;background-position:center;background-repeat:no-repeat;margin:0px;padding:0px;">
    <div class="body">
      <div style="background-color: white; padding: 20px;">
        <img class="logo" src="./../../../logo.png">
        <h1 style="text-align: center;">Carteirinha da FIEC</h1>
        <p style="text-align: center;">
          Ao acessar o site, use a senha abaixo:
        </p>
        <br>
        <div class="code">
          <span>
            ${senha_nova}
          </span>
        </div>
        <br>
        <br>
        <a class="button" style= "color: white" href="https://alunos.fiecdev.com.br" target="_blank">Acesse o Site</a>
        <br>
        <br>
        <br>
        <br>
      </div>
      <div style="background-color: white; padding: 20px;">
        <p>
          Esse email não deve ser respondido!
          <br>
          Caso tenha problemas, entre em contato com a Secretaria.
      </div>
    </div>
  </div>
  
  </html>
  `
}

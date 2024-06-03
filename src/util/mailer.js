import nodemailer from 'nodemailer'

export async function utilendEmail(to, company, password) {
  const text = `Olá,
    Sua conta foi criada com sucesso pela [Nome da Empresa].

    Aqui estão suas informações de login:
    Email: ${to}
    Senha: ${password}

    Por favor, faça login e altere sua senha o mais breve possível para garantir a segurança da sua conta.

    Para acessar sua conta, clique no link abaixo:
    [Link para o login]

    Se você tiver alguma dúvida, entre em contato conosco pelo [email de suporte] ou [telefone de suporte].

    Atenciosamente,
    [Nome da Empresa]`

  const html = `<p>Olá,</p>
    <p>Sua conta foi criada com sucesso pela <strong>[Nome da Empresa]</strong>.</p>
    <p>Aqui estão suas informações de login:</p>
    <ul>
      <li><strong>Email:</strong> ${to}</li>
      <li><strong>Senha:</strong> ${password}</li>
    </ul>
    <p>Por favor, faça login e altere sua senha o mais breve possível para garantir a segurança da sua conta.</p>
    <p>Para acessar sua conta, clique no link abaixo:</p>
    <p><a href="[Link para o login]">Login</a></p>
    <p>Se você tiver alguma dúvida, entre em contato conosco pelo <a href="mailto:[email de suporte]">[email de suporte]</a> ou <strong>[telefone de suporte]</strong>.</p>
    <p>Atenciosamente,<br>${company}</p>`

  const account = await nodemailer.createTestAccount()

  const transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  })

  const info = await transporter.sendMail({
    from: 'team@ergo-viewer.com.br',
    to,
    subject: 'Conta Criada com Sucesso!',
    text: text,
  })

  console.log('E-mail enviado: ' + info.response)
  console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info))
}

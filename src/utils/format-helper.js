export const UtilConverteParaData = (hora) => {
  const partes = hora.split(':')
  return new Date(0, 0, 0, partes[0], partes[1])
}

export const UtilOrdenaHorarios = (array) => {
  array.sort((a, b) => UtilConverteParaData(a.inicio) - UtilConverteParaData(b.inicio))
  return array
}

export const UtilVerificaConflitosDeHorarios = (array) => {
  const horariosOrdenados = UtilOrdenaHorarios(array)

  for (let i = 0; i < horariosOrdenados.length - 1; i++) {
    const atualFim = UtilConverteParaData(horariosOrdenados[i].fim)
    const proximoInicio = UtilConverteParaData(horariosOrdenados[i + 1].inicio)

    if (atualFim > proximoInicio) {
      return true
    }
  }

  return false
}

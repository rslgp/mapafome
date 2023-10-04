import '../../App.css'

function TabelaFome() {

  return (
        <div>
            <table style={{"width":"94%", "text-align":"center", "margin":"auto"}}>
            <tr style={{"background-color":"#c8dff5"}}>
            <th style={{"width":"7%"}}>Tempo<br/>de<br/>Fome</th>
            <th style={{"width":"86%"}}>Consequências ruins</th>
            <th style={{"width":"7%"}}>Risco de vida<br/>da pessoa<br/>desamparada</th>
            </tr>
            <tr>
            <td>0-3<br/>horas</td>
            <td>Mudança mínima</td>
            <td>0</td>
            </tr>
            <tr style={{"background-color":"#c8dff5"}}>
            <td>4-8<br/>horas</td>
            <td style={{"padding":"3%"}}>Você vai sentir mais fome e sua barriga vai doer um pouco, e pode ter dor de cabeça</td>
            <td>0</td>
            </tr>
            <tr>
            <td>9-12<br/>horas</td>
            <td style={{"padding":"3%"}}>Você vai começar a se sentir cansado e rabugento, raivoso, irritado, estressado e vai ter dor de cabeça</td>
            <td>baixa</td>
            </tr>
            <tr style={{"background-color":"#c8dff5"}}>
            <td>13-16<br/>horas</td>
            <td style={{"padding":"3%"}}>vai ser mais difícil prestar atenção ou se concentrar</td>
            <td>moderada</td>
            </tr>
            <tr>
            <td>17-24<br/>horas</td>
            <td style={{"padding":"3%"}}>Seu corpo vai não ter açúcar suficiente, o que vai fazer você se sentir tonto ou TREMENDO</td>
            <td>moderada</td>
            </tr>
            <tr style={{"background-color":"#c8dff5"}}>
            <td>25-48<br/>horas</td>
            <td style={{"padding":"3%"}}>Você vai se sentir fraco e entra em situação de alto estresse e em modo de sobrevivência seu coração vai bater mais rápido pois falta energia que vem da comida, então tenta trabalhar dobrado na tentativa de manter o resultado (entrega de oxigênio e nutrientes para orgão vitais)</td>
            <td>alta</td>
            </tr>
            <tr>
            <td>49-72<br/>horas</td>
            <td style={{"padding":"3%"}}>Seu corpo vai começar a usar energia armazenada (gordura,...), o que vai fazer você se sentir cansado e seu sistema imunológico vai não funcionar tão bem, fica doente mais facilmente</td>
            <td>alta</td>
            </tr>
            <tr style={{"background-color":"#c8dff5"}}>
            <td>3-7<br/>dias</td>
            <td style={{"padding":"3%"}}>Os músculos passam a serem consumidos como energia, você vai se sentir muito fraco e seus músculos vão diminuir. Isso não é bom para o seu corpo, danifica o organismo. Diminuição da motivação ou produtividade</td>
            <td>alta</td>
            </tr>
            <tr>
            <td>8-14<br/>dias</td>
            <td style={{"padding":"3%"}}>Seus órgãos, que são partes importantes do seu corpo, vão ficar feridos e você vai ficar doente muito mais facilmente</td>
            <td>muito alta</td>
            </tr>
            <tr style={{"background-color":"#c8dff5"}}>
            <td>15-21<br/>dias</td>
            <td style={{"padding":"3%"}}>Você vai ficar muito doente e sua vida vai estar em perigo</td>
            <td>extremamente alto</td>
            </tr>
            <tr>
            <td>22+<br/>dias</td>
            <td style={{"padding":"3%"}}>Você está em perigo extremo porque seu corpo não está recebendo comida suficiente, e seus órgãos vão parar de funcionar corretamente ou parar a qualquer momento</td>
            <td>extremamente alto</td>
            </tr>
            </table>
        </div>
  );
}

export default TabelaFome;

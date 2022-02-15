const envVariables = {
    "mapArea": {
        "teto":2.20,
        "chao":-14.09,
        "paredeEsquerda":-52.42,
        "paredeDireita":-34.32
    },
    "lastMarked":undefined,
    "dentroLimites": (localizacao) => {
        let permissao = false;
        permissao = 
            //cima baixo
            (localizacao[0]< envVariables.mapArea.teto && localizacao[0] > envVariables.mapArea.chao
            &&
            //esquerda direita
            localizacao[1]>envVariables.mapArea.paredeEsquerda && localizacao[1] < envVariables.mapArea.paredeDireita        
            ) || (
              //cima baixo
              localizacao[0]<-14.18 && localizacao[0] > -32.66
              &&
              //esquerda direita
              localizacao[1]>-55.55 && localizacao[1] < -38.06        
            );
        return permissao;
    },
    "telefoneFilter":false
}

export default envVariables;
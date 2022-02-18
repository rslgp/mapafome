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
    "telefoneFilter":false,
    "distanceInKmBetweenEarthCoordinates": ( lat1, lon1, lat2, lon2 ) => {
        var earthRadiusKm = 6371;

        var dLat =  (lat2-lat1) * Math.PI / 180;
        var dLon =  (lon2-lon1) * Math.PI / 180;
      
        lat1 = lat1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;
      
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 

        return earthRadiusKm * c;
    },
    "currentLocation": [],
    "criarRow": (alimento, numero, endereco, coords, telefone, diaSemana, horario, redesocial) => {

        if(numero !== ''){
            numero = ", nº"+numero;
        }
        
        
        let dadosJSON = {
            "Roaster": alimento, 
            "DateISO": new Date().toISOString(),
            "AlimentoEntregue":0,
            "Avaliacao": {
                "1":0,
                "2":0,
                "3":0,
                "4":0,
                "5":0
            },

        };
        if(numero!=="") dadosJSON.URL = numero;
        if(coords!=="") dadosJSON.Coordinates = JSON.stringify(coords);
        if(telefone!=="") dadosJSON.Telefone = telefone;
        if(diaSemana!=="") {dadosJSON.DiaSemana = diaSemana; dadosJSON.Horario = horario}
        if(redesocial!=="") dadosJSON.RedeSocial = redesocial;
        const row = {
            Dados: JSON.stringify(dadosJSON)
        };

        return row;

    }
}

export default envVariables;
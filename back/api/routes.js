const router = require("express").Router();

const regModel = require(",/regModel")


router.post("", async(req, res) => {
    try{
       const { registros } = req.body;

        if (!Array.isArray(registros) || registros.length === 0) {
        return res.status(400).json("Nenhum registro enviado!");
        }
        
        const invalidos = registros.some(
        (l) => !l.nome?.trim() || !l.codigo?.toString().trim()
        );

        if (invalidos) {
        return res.status(400).json("Nome e código não podem estar vazios!");
        }

        await regModel.insertMany(registros, { ordered: false });

        res.status(200).json("Registros salvos com sucesso!");

    } catch(err){
        res.status(500).json("Erro interno do servidor: " + err);
    }

})

router.get("", async(req, res) => {
    try{
        const allReg = await regModel.find({}, "-_id -__v")
        
        res.status(200).json(allReg)

    } catch(err){
        res.status(500).json("Erro interno do servidor: " + err);
    }
})

router.put("", async(req, res) =>{
    try{
        const { nome, novoCodigo} = req.body;

        const resultado = await regModel.findOneAndUpdate(
            {nome: nome},
            {codigo: novoCodigo},
            {new: true}
        )

        if(!resultado){
            res.status(404).json("Registro não encontrado!")
        }

        res.status(200).json(`Código do registo '${nome}' alterado!`)

    } catch(err){
        res.status(500).json("Erro interno do servidor: " + err);
    }
})

module.exports = router;
const path = require('path');
const fs = require('fs');

async function uploadMainImage(req, res) {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: "Nenhum arquivo foi enviado" });
        }

        // Obtém o arquivo do pedido
        const uploadedFile = req.files.uploadedFile;
        
        // Define o caminho de destino para salvar o arquivo
        const uploadPath = path.join(__dirname, '..', 'public', uploadedFile.name);

        // Move o arquivo para o diretório público
        uploadedFile.mv(uploadPath, (err) => {
            if (err) {
                console.error("Erro ao mover o arquivo:", err);
                return res.status(500).json({ message: "Erro ao salvar o arquivo" });
            }

            res.status(200).json({ message: "Arquivo enviado com sucesso", filePath: `/public/${uploadedFile.name}` });
        });
    } catch (error) {
        console.error("Erro no upload da imagem:", error);
        res.status(500).json({ message: "Erro no upload da imagem" });
    }
}

module.exports = {
    uploadMainImage
};
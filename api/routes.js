import { Router } from 'express';

const router = Router();

router.get('/promotions', async (req, res) => {
  const { program, id_customer, type, category, quantity, state } = req.query;
  if (!program || !id_customer) {
    return res
      .status(400)
      .json({ error: "Parâmetros 'program' e 'id_customer' são obrigatórios" });
  }

  const params = new URLSearchParams({ program, id_customer });
  if (type)     params.append('type', type);
  if (category) params.append('category', category);
  if (quantity) params.append('quantity', quantity);
  if (state)    params.append('state', state);

  const apiUrl = `https://southamerica-east1-prj-appcorp-datahub-cdp-prd.cloudfunctions.net/get-allocations-function?${params}`;

  try {
    const apiRes = await fetch(apiUrl);
    const data   = await apiRes.json();
    res.json(data);

  } catch (err) {
    console.error('Erro ao proxy:', err);
    res.status(500).json({ error: 'Falha ao obter dados da API original.' });
  }
});

export default router;

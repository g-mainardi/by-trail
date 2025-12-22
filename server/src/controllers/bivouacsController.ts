import { Bivacco, User } from '../models/models.js';

function isTokenValid(token: string): Promise<boolean> {
  return User.findOne({ apiToken: token })
    .then(user => !!user)
    .catch(() => false);
}

export const fetchBivouacs = async (req: any, res: any) => {
  const DEFAULT_SIZE_LIMIT = 50;

  try {
    const { token, options, nextPage } = req.body;
    if (!isTokenValid(token)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const bivouacs = await Bivacco.find().limit(DEFAULT_SIZE_LIMIT).exec();
    if (!bivouacs) {
      return res.status(404).json({ message: 'No bivouacs found' });
    }
    return res.status(200).json({ bivouacs });
  } catch (error) {
    console.error('Error fetching bivouacs:', error);
    return res.status(500).json({ message: 'Internal server error ->' });
  }
};

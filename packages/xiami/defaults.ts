import { makeInstaller } from './make-installer';
import Components from './components';

const installer = makeInstaller([...Components]);

export default installer;

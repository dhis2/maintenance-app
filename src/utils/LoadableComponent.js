import LoadingMask from "../loading-mask/LoadingMask.component";
import Loadable from 'react-loadable';

const LoadableComponent = opts => Loadable({
    loading: LoadingMask,
    ...opts
});

export default LoadableComponent;
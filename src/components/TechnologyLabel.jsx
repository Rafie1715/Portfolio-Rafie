import Icon from './Icon';
import { technologyDetails } from '../utils/technologies';

export default function TechnologyLabel({ technology }) {
  const { name, icon, color } = technologyDetails(technology);
  if (!name) return null;
  return <span className="inline-flex min-w-0 max-w-full items-center gap-2" data-technology={name}>
    <Icon className={`${icon} ${color} shrink-0 text-base`} />
    <span className="min-w-0 [overflow-wrap:anywhere]">{name}</span>
  </span>;
}

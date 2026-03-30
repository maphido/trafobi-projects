"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { TOPIC_LABELS, COUNTRY_FLAGS } from "@/lib/constants";

import "leaflet/dist/leaflet.css";

// Custom SVG marker icon (avoids bundler issues with Leaflet's default PNG icons)
const markerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
  <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#667eea"/>
  <circle cx="12" cy="12" r="5" fill="white"/>
</svg>`;

const projectIcon = L.divIcon({
  html: markerSvg,
  className: "",
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -36],
});

// Custom cluster icon: large purple circle with white count text
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createClusterIcon(cluster: any) {
  const count = cluster.getChildCount();
  const size = count < 10 ? 40 : count < 100 ? 48 : 56;
  return L.divIcon({
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: #667eea;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: ${size < 48 ? 14 : 16}px;
    ">${count}</div>`,
    className: "",
    iconSize: L.point(size, size),
    iconAnchor: L.point(size / 2, size / 2),
  });
}

export interface MapProject {
  id: string;
  slug: string | null;
  title: string;
  summary: string | null;
  institutionName: string | null;
  country: string | null;
  topics: string[] | null;
  latitude: number;
  longitude: number;
}

interface Props {
  projects: MapProject[];
}

export default function ProjectMap({ projects }: Props) {
  const locale = useLocale() as "de" | "en";
  const tTypes = useTranslations("institutionTypes");

  return (
    <MapContainer
      center={[54.5, 15.0]}
      zoom={4}
      maxBounds={[
        [33, -15],
        [72, 45],
      ]}
      minZoom={3}
      className="h-[500px] w-full rounded-lg sm:h-[600px]"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterIcon}>
        {projects.map((project) => (
          <Marker
            key={project.id}
            position={[project.latitude, project.longitude]}
            icon={projectIcon}
          >
            <Popup maxWidth={280}>
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold leading-snug">
                  {project.title}
                </h3>
                {project.institutionName && (
                  <p className="text-xs text-gray-500">
                    {COUNTRY_FLAGS[project.country || ""] || ""}{" "}
                    {project.institutionName}
                  </p>
                )}
                {project.summary && (
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {project.summary}
                  </p>
                )}
                {project.topics && project.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.topics.slice(0, 2).map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                      >
                        {TOPIC_LABELS[topic]?.[locale] || topic}
                      </span>
                    ))}
                  </div>
                )}
                {project.slug && (
                  <Link
                    href={`/projects/${project.slug}`}
                    className="mt-1 inline-block text-xs font-medium text-primary hover:underline"
                  >
                    {locale === "de" ? "Mehr erfahren →" : "Read more →"}
                  </Link>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}

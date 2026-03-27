"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { TOPIC_LABELS, COUNTRY_FLAGS } from "@/lib/constants";

import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icon paths (broken by bundlers)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

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
      <MarkerClusterGroup chunkedLoading>
        {projects.map((project) => (
          <Marker
            key={project.id}
            position={[project.latitude, project.longitude]}
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

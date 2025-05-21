import apiClient from "../shared/utils/apiClient";
import type {
    BodyDownloadUrl,
    Media,
    Platform,
    Profile,
    HTTPValidationError
} from './types';

export async function downloadUrl(body: BodyDownloadUrl) {
    await apiClient.post<void>('/api/download', body);
}

export async function getMediaList(
    cursor?: number,
    limit: number = 30
): Promise<Media[]> {
    const result = await apiClient.get<Media[]>('/api/media/list', { params: {cursor, limit} });
    return result.data;
}

export async function getMediaByPlatformName(
    platformName: string
): Promise<Media[]> {
    const result = await apiClient.get<Media[]>(`/api/platform/${encodeURIComponent(platformName)}`);
    return result.data;
}

export async function getPlatformList(): Promise<Platform[]> {
    const result = await apiClient.get<Platform[]>('/api/platform/list');
    return result.data;
}

export async function createPlatform(name: string): Promise<Platform> {
    const result = await apiClient.post<Platform>('/api/platform/create', { name });
    return result.data;
}

export async function deletePlatform(name: string): Promise<void> {
    await apiClient.delete(`/api/platform/${encodeURIComponent(name)}`);
}

export interface IAuthResponse {
	user: {
		id: number
		username: string
		avatarPath: string
	}
	accessToken: string
	refreshToken: string
}

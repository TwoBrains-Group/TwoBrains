import {config} from '@utils/config'

const UPLOADS_URI = `http://${process.env.HOST}:${process.env.PORT}${process.env.UPLOADS_DIR}`

export const prepareProject = (project: Record<any, any>): void => {
    if (!project.image) {
        project.image = `${UPLOADS_URI}${config.project.defaultImage}`
    }

    if (!project.coverImage) {
        project.coverImage = `${UPLOADS_URI}${config.project.defaultCoverImage}`
    }
}

export const prepareProjects = (projects: Record<any, any>[]): void => {
    for (const project of projects) {
        prepareProject(project)
    }
}

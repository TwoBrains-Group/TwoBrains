import pt from '@modules/pretty-time'

export const prepareIdea = (idea: Record<string, any>): Record<string, any> => {
    idea.prettyCreationDatetime = pt.prettyDiff(idea.creationDatetime)
    idea.creationDatetime = pt.prettyDate(idea.creationDatetime)
    return idea
}

export const prepareIdeas = (ideas: any[]): any[] => ideas.map(prepareIdea)

namespace app.Services{
  interface ICommentResourceClass extends app.i.IComment, ng.resource.IResource<ICommentResourceClass>{}
  interface ICommentResource extends ng.resource.IResourceClass<ICommentResourceClass>{}

  export class CommentService{
    private CommentResource: ICommentResource;

    public create(comment:app.i.IComment) {
      return this.CommentResource.save(comment).$promise;
    }

    public remove(id: string) {
      return this.CommentResource.remove({id:id}).$promise;
    }

    constructor(private $resource: ng.resource.IResourceService) {
      this.CommentResource = <ICommentResource>$resource('/api/v1/comments/:id');
    }
  }
  angular.module('app').service('CommentService', CommentService);
}

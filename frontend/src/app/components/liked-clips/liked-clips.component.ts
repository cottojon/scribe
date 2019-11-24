import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ClipDisplay } from 'src/app/classes/clip-display';
import { LikesService } from 'src/app/services/likes.service';
import { CommentsService } from 'src/app/services/comments.service';
import { ProfileService } from 'src/app/services/profile.service';
import { ClipComment } from 'src/app/classes/clip-comment';
import { LikedClip } from 'src/app/classes/liked-clip';
import { ChannelService } from 'src/app/services/channel.service';

@Component({
  selector: 'app-liked-clips',
  templateUrl: './liked-clips.component.html',
  styleUrls: ['./liked-clips.component.css']
})
export class LikedClipsComponent implements OnInit {
  clipDisplays: ClipDisplay[];
  likedClips: LikedClip[];

  constructor(
    private authService: AuthenticationService,
    private likesService: LikesService,
    private commentsService: CommentsService,
    private profileService: ProfileService,
    private channelService: ChannelService
  ) { }

  ngOnInit() {
    this.authService.checkAndNavigateToLogin();
    this.getClips();
  }

  getClips(): void {
    this.refreshLikedClips();
    let clipDisplays = [];
    let commentRequestCount = 0;
    this.likesService.getLikedClips().subscribe((clips) => {
      clips.forEach(clip => {
        this.commentsService.getCommentsByClipId(clip.clipId).subscribe((comments) => {
          clipDisplays.push(new ClipDisplay(clip.clip, clip.clip.channelId, comments));

          commentRequestCount++;
          if (commentRequestCount >= clips.length) {
            this.clipDisplays = clipDisplays;
          }
        });
      });
    });
  }
  
  showRevisedText(clipDisplay: ClipDisplay): void {
    clipDisplay.displayed_text = clipDisplay.clip.revised_text;
    clipDisplay.displayingOriginalText = false;
  }

  showOriginalText(clipDisplay: ClipDisplay): void {
    clipDisplay.displayed_text = clipDisplay.clip.text;
    clipDisplay.displayingOriginalText = true;
  }

  toggleShowComments(clipDisplay: ClipDisplay): void {
    clipDisplay.showingComments = !clipDisplay.showingComments;
  }

  toggleWritingComment(clipDisplay: ClipDisplay): void {
    clipDisplay.writingComment = !clipDisplay.writingComment;
    if (clipDisplay.writingComment){
      clipDisplay.newCommentText = "";
      clipDisplay.showingComments = true;
    }
  }

  loadCommentUserInfo(comment: ClipComment): void {
    if (comment.userName === null || comment.userName === undefined || comment.userName === ""){
      this.profileService.getUsernameById(comment.userId).subscribe((response) => {
        comment.userName = response["username"];
      });
    }

    if (!comment.profileImageLoaded && !comment.profileImageLoading) {
      comment.profileImageLoading = true;
      let fileReader = new FileReader();
      this.profileService.getImageByUserId(comment.userId).subscribe((raw) => {
        if (raw && raw.size != 0) {
          fileReader.addEventListener("load", () => { comment.profileImage = fileReader.result; comment.profileImageLoaded = true;}, false);
          fileReader.readAsDataURL(raw);
        }
      });
    }
  }

  submitComment(clipDisplay: ClipDisplay): void {
    this.commentsService.postCommentToClip(clipDisplay.clip.id, clipDisplay.newCommentText).subscribe((comment) => {
      clipDisplay.comments.push(comment);
    });
    this.toggleWritingComment(clipDisplay);
  }
  
  refreshLikedClips(): void {
    this.likesService.getLikedClips().subscribe((likedClips) => {
      this.likedClips = likedClips;
    })
  }

  likeClip(clipDisplay: ClipDisplay) {
    this.likesService.likeClip(clipDisplay.clip.id).subscribe(x => this.refreshLikedClips());
  }

  unlikeClip(clipDisplay: ClipDisplay) {
    this.likesService.unlikeClip(clipDisplay.clip.id).subscribe(x => this.refreshLikedClips());
  }

  clearResults(): void {
    this.clipDisplays = [];
  }
  
  checkIfClipIsLiked(clipId: number): boolean {
    return this.likedClips.some(x => x.clipId === clipId);
  }

  makeCorrection(clipDisplay: ClipDisplay): void {
    clipDisplay.editing = true;
  }

  saveCorrection(clipDisplay: ClipDisplay): void {
    clipDisplay.editing = false;
    this.channelService.updateClip(clipDisplay.clip.id, clipDisplay.displayed_text).subscribe(() => {
      this.channelService.ReinitalizeService();
      this.getClips();
    });
  }

  playClip(clipDisplay: ClipDisplay): void {
    const audio = new Audio();
    audio.src = ('../../../assets/clips/' + clipDisplay.clip.path_to_file.toString());
    audio.load();
    audio.play();
  }
}

